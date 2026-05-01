pipeline {
    agent any

    tools {
        nodejs 'nodejs-25-9-0'
    }

    stages {
        stage('Node version') {
            steps {
                sh '''
                echo "Workspace:"
                pwd
                echo "files:"
                ls -la
                '''
            }
        }
    }
}