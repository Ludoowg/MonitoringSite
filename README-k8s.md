Prérequis : 

Pour la partie k8s, j'ai d'abord installer lancer le cluster directement grâce a docker desktop, il faut ensuite activer kubernetes sur docker desktop et avoir kubectl de fonctionnel
Kustomize est nécessaire pour pouvoir gérer en meme temps plusieurs version de mon cluster, il a fallut également rebuild l'image jenkins en lui rajoutant kustomize pour pouvoir ensuite rentrer des commandes kustomize directement depuis les stages jenkins 

J'ai du installer le nginx gateway fabric afin de m'en servir comme reverse proxy. pour cela j'ai ajouter les CRDs de la gateway api, puis j'ai installer helm via homebrew ( macOS ) et ensuite j'ai install la charte helm du nginx gateway fabric 
dans la configuration de ce projet, attention a créer uniquement un manifest pour le gateway et pour le http route, ne pas créer de gatewayclass car le helm le gère et le crée tout seul, un conflit à eu lieu a cause de cela sur le projet

pour l'organisation j'ai séparé les manifest en plusieurs sous dossier, d'abord le dossier bootstrap qui contient le manifest pour créer le namespace et un autre pour créer le secret, je l'ai créer à par pour pouvoir le lancer avant le reste car ce sont des ressources dont dépendes les autres pod de mon cluster et donc il faut qu'elle soit présente lors de la création des ressources

Un fichier template du secret est disponible dans le dossier git tandis que le fichier contenant les variables sensible à été gitignoré. 
Pour déployer copier le secret-example.yaml , le renommer en secret.yaml et remplacer les placeholder par vos vrais valeur de postgres 
ne pas oublier de vérifier que database_url utilise bien le service postgres 

J'ai un dossier infra qui contient le manifest qui ma été nécessaire pour activer les metrics-server sur le projet, nécessaire car j'ai ensuite rajouter un hpa dans l'overlays prod grâce a kustomize, donc j'avais besoin que le hpa accède au metrics server pour savoir comment ajuster le nombre de réplicas en fonction de l'utilisation du cpu

Pour déployer l'application dans l'ordre, il faut d'abord déployer le dossier bootstrap qui contient le manifest du namespace et du secret, suivie du dossier infra pour activer les metrics server, et pour finir déployer soit le dossier dev soit le dossier prod en fonction de la situation.

initialement, dans la base les pods utilise une image latest 
grâce à kustomize je met automatiquement à jour les tag d'image dans mon dossier overlays/prod via un stage jenkins qui va directement aller update les images de mon dossier github avec les dernières images que j'ai push dans mon docker hub
vérifier que les images existent bien dans le docker hub avant le premier deploiement 


le dossier base qui contient les manifest des choses? qui sont obliger d'être la pour la base de mon application. déjà il y a le déploiement du backend et du frontend, relié au secret que jai déployer grâce a bootstrap, il y a mon statefulset postgresql, j'ai le pvc pour le postgresql également afin de pouvoir lui octroyer un espace volume dédié sur le cluster, j'ai le service pour le frontend le backend et pour postgres afin de pouvoir tous les exposer sur le réseau interne du cluster et surtout de pouvoir résoudre le nom de ses services grâce au dns du cluster. 

pour le routage du frontend je passe mon arg de build dans le stage jenkins qui va build mon image frontend avec --build-arg= VITE_API_URL=/api, ainsi mon gateway redirigera vers le frontend les appel du navigateur vers / et vers le backend pour les appel navigateur vers /api

Mon pvc fait une demande de persistance de données qui sera utilisé par postgresql, la suppression du pod statefulset ne supprime donc pas les données de ma BDD tant que le pvc est conservé et que le nouveau pod remontent le même stockage via le volumemount. 

j'ai également mis des readiness qui permettent de vérifier que mes container sont pret a recevoir du trafic, si un pod est non ready il est temporairement retirer des endpoint du service, et des liveness qui permette de vérifier si un container est bloqué ou en beug et de le rédémarrer si c'est le cas. 

mon gateway me sert de reverse-proxy et redirige les connexion entrantes soit vers le frontend soit vers des appels pour le backend 
J'ai défini les règles de cela dans mon httproute , pour finir j'ai un fichier kustomization pour pouvoir déployer mes ressources directement avec 

pour joindre mon gateway en local, je port-forward le service du nginx gateway sur un port local de ma machine

J'ai aussi mis des patch de request et de limit dans les fichiers de kustomization des dossier dev et prod, les cpu request servent à définir des règles de base à suivre pour le metrics server et les limits pour le plafond maximal autorisé du container. 

dans ma version dev je requiert moins de ressources au cluster et je ne fais qu'un seul réplicas de mes pods backend et frontend, alors que dans ma version prod j'ai installer un horizontal pod autoscaler qui va augmenter ou diminuer mon nombre de pod en fonction de la consommation direct de ceux-ci, j'ai défini la ressources a observer comme étant le cpu


tout tourne en local sur k8s pour le moment

