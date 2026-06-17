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

        stage('Install dependencies'){
            parallel{

                stage('Install dependencies backend') {
                    steps {
                        dir('backend') {
                            sh 'npm ci --no-audit'
                        }
                    }
                }

                stage('Install dependencies frontend'){
                    steps{
                        dir('frontend'){
                            sh 'npm ci --no-audit'
                        }
                    }
                }

            }
        }

        stage('Test backend and frontend'){
            parallel{

                stage('Test backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run test:coverage'
                            sh 'npx prisma validate'
                        }
                    }
                }

                stage('Test frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('NPM audit'){
            parallel{

                stage('NPM Dependencies Audit backend') {
                    steps {
                        dir('backend') {
                            catchError(buildResult: 'UNSTABLE', message: 'Vulnerability detected') {
                                sh '''npm audit --audit-level=high'''
                            }
                        
                        }
                    }
                }

                stage('NPM Dependencies Audit frontend') {
                    steps {
                        dir('frontend') {
                            catchError(buildResult: 'UNSTABLE', message: 'Vulnerability detected') {
                                sh '''npm audit --audit-level=high'''
                            }
                        
                        }
                    }
                }

            }
        }


        // stage('Test docker BDD'){
        //     steps{
        //         sh 'echo $PSQL_CREDENTIALS'
        //         sh 'echo $PSQL_CREDENTIALS_PSW'
        //         sh 'echo $PSQL_CREDENTIALS_USR'
        //         sh 'PGPASSWORD="$PSQL_CREDENTIALS_PSW" psql -h monitoring-postgres -p 5432 -U $PSQL_CREDENTIALS_USR -d instamailing -c "SELECT current_user, current_database();"'
        //     }
        // }



        // stage('Dependency Scanning') {

        //     parallel {


        //         stage('OWASP Dependency Check') {
        //             steps {
        //                 dependencyCheck ( additionalArguments: '''
        //                     --scan \'./\'
        //                     --out \'./\'
        //                     --format \'ALL\'
        //                     --disableYarnAudit
        //                     --prettyPrint ''', odcInstallation: 'OWASP-DepCheck-12',

        //                 nvdCredentialsId: 'NVD-API-KEY')

        //                 junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'

        //                 publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './',
        //                  reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check Report', 
        //                  reportTitles: '', useWrapperFileDirectly: true])
        //             }
        //         }

        //         stage('SonarQube Analysis') {
        //             steps {
        //                 catchError(buildResult: 'SUCCESS', message: 'Oops', stageResult: 'UNSTABLE') {
        //                     timeout(time: 5, unit: 'MINUTES') {
        //                             withSonarQubeEnv('sonarqube-server') {
        //                                 sh 'echo $SONAR_SCANNER'
        //                                 sh '''
        //                                 $SONAR_SCANNER/bin/sonar-scanner \
        //                                     -Dsonar.exclusions=**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/dependency-check-*.html,**/dependency-check-*.xml,**/dependency-check-report.json \
        //                                     -Dsonar.projectKey=Monitoring-Site \
        //                                     -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info \
        //                                     -X
        //                                 '''
        //                             }
        //                             waitForQualityGate abortPipeline: true
        //                     }
        //                 }
                        
        //             } 
        //         }

        //     }
        // }

        // stage('Build docker image'){
        //     steps{
        //         sh 'docker build -f Dockerfile -t ludoowg/monitoring-site:$GIT_COMMIT .'
        //     }
        // }

        // stage("Where i am ?"){
        //     steps{
        //         sh 'pwd'
        //         sh 'ls -la'
        //     }   
        // }

        // stage('Trivy scanning'){       
        //     steps{
        //         sh '''
        //             docker run --rm \
        //             -v /var/run/docker.sock:/var/run/docker.sock \
        //             -v "$WORKSPACE:/trivy-results" \
        //             --name trivy \
        //             aquasec/trivy:latest \
        //             image ludoowg/monitoring-site:$GIT_COMMIT \
        //             --severity LOW,MEDIUM \
        //             --exit-code 0 \
        //             --format json -o /trivy-results/trivy-image-MEDIUM-results.json
        //         '''
        //     }
        // }

        // stage('Push Docker Image'){
        //     steps{
        //             withDockerRegistry(credentialsId: '1b517279-c3c9-4cfe-baf4-f51a2d9dbeca', url: '') {
        //             sh 'docker push ludoowg/monitoring-site:$GIT_COMMIT'
        //         }
        //     }
        // }

    }
}


