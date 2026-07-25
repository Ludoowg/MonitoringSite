Pour la partie k8s, j'ai d'abord installer lancer le cluster directement grâce a docker desktop 


pour l'organisation j'ai séparé les manifest en plusieurs sous dossier, d'abord le dossier bootstrap qui contient le manifest pour créer le namespace et un autre pour créer le secret, je l'ai créer à par pour pouvoir le lancer avant le reste car ce sont des ressources dont dépendes les autres pod de mon cluster et donc il faut qu'elle soit présente lors de la création des ressources

ensuite le dossier base qui contient les manifest des choses? qui sont obliger d'être la pour la base de mon application. déjà il y a le déploiement du backend et du frontend, relié au secret que jai déployer grâce a bootstrap, il y a mon statefulset postgresql, j'ai le pvc pour le postgresql également afin de pouvoir lui octroyer un espace volume dédié sur le cluster, j'ai le service pour le frontend le backend et pour postgres afin de pouvoir tous les exposer sur le réseau interne du cluster et surtout de pouvoir résoudre le nom de ses services grâce au dns du cluster. J'ai également un gateway qui va me servir de reverse-proxy et qui va rediriger les connexion entrantes soit vers le frontend soit vers des appels pour le backend 
J'ai défini les règles de cela dans mon httproute , pour finir j'ai un fichier kustomization car j'ai installer kustomize pour pouvoir gérer dynamiquement plusieurs version de mon cluster 

J'ai un dossier infra qui contient le manifest qui ma été nécessaire pour activer les metrics-server sur le projet, indispensable car j'ai ensuite rajouter un hpa dans l'overlays prod grâce a kustomize, donc j'avais besoin que le hpa accède au metrics server pour savoir comment ajuster le nombre de réplicas en fonction de la puissance de consommation 
J'ai aussi mis des patch de request et de limit dans les fichiers de kustomization des dossier dev et prod afin d'avoir des règles de base à suivre pour le metrics server.

tout tourne en local sur k8s pour le moment

