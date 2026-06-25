pipeline {
    agent any

    options{
        buildDiscarder(logRotator(
            numToKeepStr: '30',
            artifactNumToKeepStr: '30'
        ))
    }

    tools {
        nodejs 'nodejs-25-9-0'
    }

    environment {
        PSQL_CREDENTIALS = credentials('Postgres-credentials')
        SONAR_SCANNER = tool 'sonarqube-scanner-610'
        DATABASE_URL = credentials('DATABASE_URL')
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
                            sh 'npm run test:coverage'
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


        stage('OWASP Dependency Check') {

            steps {

                sh 'rm -rf ./owasp-report/ && mkdir -p owasp-report/'

                dependencyCheck ( additionalArguments: '''
                    --scan \'./backend\'
                    --scan \'./frontend\'
                    --out \'./owasp-report/\'
                    --format \'ALL\'
                    --disableYarnAudit
                    --prettyPrint 
                    --noupdate
                    ''', odcInstallation: 'OWASP-DepCheck-12',

                nvdCredentialsId: 'NVD-API-KEY')

                junit allowEmptyResults: true, testResults: 'owasp-report/dependency-check-junit.xml', skipPublishingChecks: true

                publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './owasp-report',
                 reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check Report', 
                 reportTitles: '', useWrapperFileDirectly: true])
            }
        }


        // stage('Sonarqube analysis'){
        //     parallel{

        //         stage('SonarQube Analysis Backend') {
        //             steps {
        //                 dir('backend'){
        //                     catchError(buildResult: 'SUCCESS', message: 'Oops', stageResult: 'UNSTABLE') {
        //                         timeout(time: 5, unit: 'MINUTES') {
        //                                 withSonarQubeEnv('sonarqube-server') {
                                        
        //                                         sh '''
        //                                             $SONAR_SCANNER/bin/sonar-scanner \
        //                                                 -Dsonar.sources=src \
        //                                                 -Dsonar.tests=tests \
        //                                                 -Dsonar.exclusions=**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/dependency-check-*.html,**/dependency-check-*.xml,**/dependency-check-report.json \
        //                                                 -Dsonar.projectKey=Monitoringsite-backend \
        //                                                 -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
        //                                                 -X
        //                                             echo "====== Sonar report task ======="
        //                                             cat .scannerwork/report-task.txt || true
        //                                         '''
                                                                        
        //                                 }
        //                             waitForQualityGate abortPipeline: true
        //                         }
        //                     }
        //                 }
        //             } 
        //         }

        //         stage('SonarQube Analysis Frontend') {
        //             steps {
        //                 dir('frontend'){
        //                     catchError(buildResult: 'SUCCESS', message: 'Oops', stageResult: 'UNSTABLE') {
        //                         timeout(time: 5, unit: 'MINUTES') {
        //                                 withSonarQubeEnv('sonarqube-server') {
                                            
        //                                         sh '''
        //                                             $SONAR_SCANNER/bin/sonar-scanner \
        //                                                 -Dsonar.sources=src \
        //                                                 -Dsonar.tests=src \
        //                                                 -Dsonar.test.inclusions=**/*.test.{js,jsx},**/*.spec.{js,jsx} \
        //                                                 -Dsonar.exclusions=**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/dependency-check-*.html,**/dependency-check-*.xml,**/dependency-check-report.json \
        //                                                 -Dsonar.projectKey=Monitoringsite-frontend \
        //                                                 -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
        //                                                 -X
        //                                             echo "====== Sonar report task ======="
        //                                             cat .scannerwork/report-task.txt || true
        //                                         '''                            
        //                                 }
        //                             waitForQualityGate abortPipeline: true
        //                         }
        //                     }
        //                 }
                        
        //             } 
        //         }

                
        //     }
        // }     


        // stage('Build docker image'){
        //     parallel{

        //         stage('Build docker image backend'){
        //             steps{
        //                 dir('backend'){
        //                     sh '''
        //                     docker build \
        //                     -f Dockerfile \
        //                     -t ludoowg/monitoring-site-backend:$GIT_COMMIT \
        //                     -t ludoowg/monitoring-site-backend:latest \
        //                     .
        //                    '''
        //                 }
        //             }
        //         }

        //         stage('Build docker image frontend'){
        //             steps{
        //                 dir('frontend'){
        //                     sh '''
        //                     docker build \
        //                     -f Dockerfile \
        //                     -t ludoowg/monitoring-site-frontend:$GIT_COMMIT \
        //                     -t ludoowg/monitoring-site-frontend:latest \
        //                     .
        //                    '''
        //                 }
        //             }
        //         }
        //     }
        // }
        

        // stage('Trivy scanning monitoring-site'){
        //     parallel{

        //         stage('Trivy scanning backend'){
        //             steps{
        //                     sh '''

        //                         mkdir -p trivy-results

        //                         echo "====== Trivy table report backend======"

        //                         docker run --rm \
        //                         -v /var/run/docker.sock:/var/run/docker.sock \
        //                         aquasec/trivy:latest \
        //                         image ludoowg/monitoring-site-backend:$GIT_COMMIT \
        //                         --severity HIGH,CRITICAL \
        //                         --exit-code 0 \
        //                         --format table

        //                         echo "====== Trivy json report backend======"

        //                         docker run --rm \
        //                         -v /var/run/docker.sock:/var/run/docker.sock \
        //                         -v "$WORKSPACE/trivy-results:/results" \
        //                         aquasec/trivy:latest \
        //                         image ludoowg/monitoring-site-backend:$GIT_COMMIT \
        //                         --severity HIGH,CRITICAL \
        //                         --exit-code 0 \
        //                         --format json -o /results/trivy-backend-results.json
        //                     '''

        //                     archiveArtifacts artifacts: 'trivy-results/trivy-backend-results.json', allowEmptyArchive: true
        //                 }
        //         }

        //         stage('Trivy scanning frontend'){
        //             steps{
        //                     sh '''

        //                         echo "====== Trivy table report frontend======"

        //                         docker run --rm \
        //                         -v /var/run/docker.sock:/var/run/docker.sock \
        //                         aquasec/trivy:latest \
        //                         image ludoowg/monitoring-site-frontend:$GIT_COMMIT \
        //                         --severity HIGH,CRITICAL \
        //                         --exit-code 0 \
        //                         --format table

        //                         echo "====== Trivy json report frontend======"

        //                         docker run --rm \
        //                         -v /var/run/docker.sock:/var/run/docker.sock \
        //                         -v "$WORKSPACE/trivy-results:/results" \
        //                         aquasec/trivy:latest \
        //                         image ludoowg/monitoring-site-frontend:$GIT_COMMIT \
        //                         --severity HIGH,CRITICAL \
        //                         --exit-code 0 \
        //                         --format json -o /results/trivy-frontend-results.json
        //                     '''

        //                     archiveArtifacts artifacts: 'trivy-results/trivy-frontend-results.json', allowEmptyArchive: true
        //                 }
        //         }
    
        //     }       
            
        // }


        // stage('Push Docker Image'){
        //     steps{
        //             withDockerRegistry(credentialsId: 'docker-repo', url: '') {
        //             sh '''
        //                 docker push ludoowg/monitoring-site-backend:$GIT_COMMIT
        //                 docker push ludoowg/monitoring-site-backend:latest

        //                 docker push ludoowg/monitoring-site-frontend:$GIT_COMMIT
        //                 docker push ludoowg/monitoring-site-frontend:latest
        //             '''
        //         }
        //     }
        // }

    }
}


