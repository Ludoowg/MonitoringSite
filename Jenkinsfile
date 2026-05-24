pipeline {
    agent any

    tools {
        nodejs 'nodejs-25-9-0'
    }

    environment {
        PSQL_CREDENTIALS = credentials('Postgres-credentials')
        SONAR_SCANNER = tool 'sonarqube-scanner-610'
    }

    stages {

        stage('Install dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install --no-audit'
                }
            }
        }

        stage('Test docker BDD'){
            steps{
                sh 'echo $PSQL_CREDENTIALS'
                sh 'echo $PSQL_CREDENTIALS_PSW'
                sh 'echo $PSQL_CREDENTIALS_USR'
                sh 'PGPASSWORD="$PSQL_CREDENTIALS_PSW" psql -h monitoring-postgres -p 5432 -U $PSQL_CREDENTIALS_USR -d instamailing -c "SELECT current_user, current_database();"'
            }
        }

        stage('Dependency Scanning') {

            parallel {

                // stage('NPM Dependencies Audit') {
                //     steps {
                //         dir('backend') {
                //         sh '''
                //             npm audit --audit-level=critical
                //                 echo $?
                //             '''
                //         }
                //     }
                // }

                // stage('OWASP Dependency Check') {
                //     steps {
                //         dependencyCheck ( additionalArguments: '''
                //             --scan \'./\'
                //             --out \'./\'
                //             --format \'ALL\'
                //             --prettyPrint ''', odcInstallation: 'OWASP-DepCheck-12',

                //         nvdCredentialsId: 'NVD-API-KEY')

                //         junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'

                //         publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './',
                //          reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check Report', 
                //          reportTitles: '', useWrapperFileDirectly: true])
                //     }
                // }

                stage('SonarQube Analysis') {
                    steps {
                        sh 'echo $SONAR_SCANNER'
                        sh '''
                        $SONAR_SCANNER/bin/sonar-scanner \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.token=sqp_c1da75bead468303623fc0f7cd5a4ecbb211820c \
                            -Dsonar.projectKey=Monitoring-Site \
                            -X
                        '''
                    }
                }
            }
        }       
    }
}
