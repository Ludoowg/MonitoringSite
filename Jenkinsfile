pipeline {
    agent any

    tools {
        nodejs 'nodejs-25-9-0'
    }

    stages {
        stage('Install dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install --no-audit'
                }
            }
        }
        stage('NPM Dependencies Audit') {
            steps {
                dir('backend') {
                sh '''
                    npm audit --audit-level=critical
                        echo $?
                    '''
                }
            }
        }
    }
}