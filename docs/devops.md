# DevOps — stratégie et mode apprentissage

**Statut** : draft · **Date** : 2026-09-13 · ADR liés : 006, 007, 008, 009

## 1. Pourquoi

| Outil | Valeur réelle pour ce projet | Valeur pédagogique |
|---|---|---|
| **Git + GitHub Actions** | Indispensable : qualité automatisée, déploiement sans intervention | Pipelines, secrets, artefacts, matrices |
| **Docker** | Utile : build reproductible, image servie identique en local, en CI et sur un VPS de repli | Dockerfile multi-stage, layers, healthcheck, réseau, compose |
| **Cloudflare (Worker d'assets statiques)** | Indispensable : prod gratuite, CDN, HTTPS, aperçus | Déploiement continu, en-têtes, redirections |
| **Kubernetes** | **Aucune** en production pour un site statique | Deployments, Services, probes, rolling updates, Kustomize, Ingress |

Verdict honnête : Kubernetes n'entre pas dans le chemin de production. Il vit dans un cluster local `kind` comme **laboratoire**, avec des manifests écrits comme pour une vraie prod afin que l'apprentissage soit transférable.

## 2. Pipeline cible

```text
Developer ── git push ──► GitHub
                            │
                            ├──► ci.yml (push, PR)
                            │      lint → typecheck → unit → build → e2e → Lighthouse CI
                            │
                            ├──► Cloudflare (intégration Git, Worker d'assets)
                            │      branche → aperçu https://<branche>-tks-web.zobel-tchomgui.workers.dev
                            │      main    → production https://tks-web.zobel-tchomgui.workers.dev
                            │
                            └──► docker.yml (tag v*)
                                   build multi-arch → push ghcr.io/<owner>/tks-web:<tag>,latest
                                          │
                                          └──► labo kind (kubectl apply -k k8s/overlays/local)
                                               ou VPS de repli (docker run)
```

### Environnements

| Environnement | Où | Source | Variables |
|---|---|---|---|
| `dev` | Poste local, `npm run dev` ou `docker compose up dev` | branche courante | `.env` local (non commité), `PUBLIC_WHATSAPP_NUMBER` factice |
| `preview` | Cloudflare | chaque branche poussée | Variables d'environnement « Preview » |
| `production` | Cloudflare | `main` | Variables d'environnement « Production » |
| `lab` | kind local | image GHCR ou build local | ConfigMap |

### Variables et secrets

Le site est statique : toute variable `PUBLIC_*` est **injectée au build** et devient publique dans le HTML. Il n'y a donc **aucun secret applicatif**. Les seuls secrets sont ceux de la chaîne : `GITHUB_TOKEN` (fourni) pour GHCR. La distinction build-time / run-time est un point d'apprentissage clé : changer le numéro WhatsApp exige un nouveau build, pas un redémarrage de conteneur.

### Versioning et rollback

- Conventional Commits ; SemVer ; tag `vX.Y.Z` sur `main` déclenche l'image Docker.
- Rollback prod : redéployer une version précédente depuis le tableau de bord Cloudflare, ou `git revert` puis push.
- Rollback labo : `kubectl rollout undo deployment/tks-web`.

## 3. Docker

```text
docker/
├── Dockerfile          # multi-stage
├── nginx.conf          # cache, gzip/brotli, en-têtes, 404 personnalisée
├── compose.yml         # services : dev (node, hot reload), web (image prod)
└── .dockerignore
```

Dockerfile (esquisse, écrit en spec 001) :

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG PUBLIC_WHATSAPP_NUMBER
ARG PUBLIC_SITE_URL
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/healthz || exit 1
USER nginx
```

Points d'apprentissage : cache des layers (copier `package*.json` avant le reste), `ARG` vs `ENV`, image finale sans Node, utilisateur non-root, port non privilégié, endpoint `/healthz` servi par nginx.

## 4. Kubernetes (labo)

```text
k8s/
├── base/
│   ├── kustomization.yaml
│   ├── namespace.yaml        # tks
│   ├── deployment.yaml       # 2 réplicas, probes, requests/limits, RollingUpdate maxSurge 1 / maxUnavailable 0
│   ├── service.yaml          # ClusterIP 80 → 8080
│   ├── configmap.yaml        # nginx.conf monté (pour montrer la config externalisée)
│   └── secret.example.yaml   # pédagogique : un secret factice, jamais un vrai
└── overlays/
    └── local/
        ├── kustomization.yaml  # image locale, namespace, patch réplicas
        └── ingress.yaml        # ingress-nginx, host tks.local
```

Prérequis (phase 001) : Docker Desktop, `kind`, `kubectl`, `kustomize` (inclus dans kubectl). Cluster : `kind create cluster --config k8s/kind-config.yaml` (1 control-plane + 2 workers, port 80 mappé).

## 5. Production-ready vs pédagogique

| Élément | Production-ready | Pédagogique uniquement | Note |
|---|---|---|---|
| `ci.yml` | ✔ | | Bloque les merges |
| Cloudflare, Worker d'assets | ✔ | | Prod réelle |
| `Dockerfile`, `nginx.conf` | ✔ | | Utilisable sur un VPS tel quel |
| `compose.yml` dev | ✔ | | Environnement reproductible |
| Image sur GHCR | ✔ | | Artefact versionné |
| `k8s/base` | (✔ qualité prod) | ✔ usage | Écrit proprement, non déployé en prod |
| `k8s/overlays/local`, Ingress `tks.local` | | ✔ | Cluster local |
| `secret.example.yaml` | | ✔ | Montre le mécanisme, sans vrai secret |
| Exercices ci-dessous | | ✔ | |

## 6. Ce que j'apprends

- Docker : image, layers, multi-stage, `ARG`/`ENV`, `HEALTHCHECK`, utilisateur non-root, réseaux compose, volumes pour le hot reload.
- CI : jobs, cache npm, artefacts de build, matrices de navigateurs Playwright, Lighthouse CI avec budgets.
- Registry : tags immuables, `latest`, multi-arch (`amd64` + `arm64`).
- Kubernetes : namespace, Deployment, ReplicaSet, Pod, Service, Ingress, ConfigMap, Secret, probes liveness/readiness/startup, requests/limits, rolling update, rollback, scaling, `kubectl` (get, describe, logs, exec, port-forward, rollout), Kustomize base/overlay.
- Exploitation : lire des logs, diagnostiquer un pod `CrashLoopBackOff`, comprendre `ImagePullBackOff`.

## 7. Exercices

Chaque exercice a un objectif, des commandes, et une question d'observation. Ils sont réalisés au fil des specs 001 et 007.

| # | Exercice | Objectif | Question d'observation |
|---|---|---|---|
| 1 | `docker build -t tks-web:dev .` puis rebuild après un changement de composant | Cache des layers | Quels layers sont reconstruits ? Pourquoi `npm ci` ne l'est pas ? |
| 2 | `docker run -p 8080:8080 tks-web:dev` puis `docker logs -f` | Cycle de vie, logs nginx | Que voit-on à chaque requête ? |
| 3 | `docker inspect --format '{{.State.Health.Status}}'` | Healthcheck | Que se passe-t-il si `/healthz` renvoie 500 ? Modifier nginx.conf pour le simuler |
| 4 | Rebuild avec `--build-arg PUBLIC_WHATSAPP_NUMBER=...` | Build-time vs run-time | Pourquoi un `docker run -e` ne change rien ? |
| 5 | `docker compose up dev` et modifier un fichier | Volumes, hot reload | Où vit `node_modules` ? |
| 6 | `kind create cluster --config k8s/kind-config.yaml`, `kubectl get nodes` | Cluster local | Combien de nœuds ? Quels pods système ? |
| 7 | `kind load docker-image tks-web:dev`, `kubectl apply -k k8s/overlays/local`, `kubectl get pods -n tks -w` | Deployment, Service, Ingress | Sur quels nœuds sont les pods ? Pourquoi ? |
| 8 | `kubectl scale deployment/tks-web --replicas=3 -n tks` | Scaling | Combien de temps pour le 3e pod ? |
| 9 | Rebuild `tks-web:v2` (changer un texte), `kubectl set image ...`, `kubectl rollout status` | Rolling update | À quel moment le nouveau texte apparaît-il ? Y a-t-il eu une coupure ? |
| 10 | `kubectl delete pod <un pod> -n tks` | Auto-réparation | Combien de temps avant un remplaçant ? Le service a-t-il répondu pendant ce temps ? |
| 11 | Casser la readiness probe (mauvais chemin) et redéployer | Probes | Que fait le rollout ? Pourquoi les anciens pods restent-ils ? |
| 12 | `kubectl rollout undo deployment/tks-web -n tks` | Rollback | Quelle révision est active ? (`rollout history`) |
| 13 | Baisser `limits.memory` à 8Mi et observer | Ressources | Quel statut prend le pod ? |
| 14 | `kubectl create secret generic ...` puis le monter en variable | Secrets | En quoi diffère-t-il d'un ConfigMap ? Est-il chiffré ? |

## 8. Coûts

| Poste | Coût |
|---|---|
| GitHub (dépôt privé, Actions 2 000 min/mois) | 0 € |
| GHCR (images) | 0 € (limites généreuses pour un dépôt) |
| Cloudflare, offre gratuite | 0 € |
| Nom de domaine `.com` | ≈ 10 €/an |
| kind, Docker Desktop (usage personnel) | 0 € |

## Documents liés

- [technical-decisions.md](./technical-decisions.md) ADR-006 à 009
- [testing-strategy.md](./testing-strategy.md) pour le contenu de `ci.yml`
