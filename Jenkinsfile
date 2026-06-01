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

        // stage('Install dependencies') {
        //     steps {
        //         dir('backend') {
        //             sh 'npm install --no-audit'
        //         }
        //     }
        // }

        // stage('Test docker BDD'){
        //     steps{
        //         sh 'echo $PSQL_CREDENTIALS'
        //         sh 'echo $PSQL_CREDENTIALS_PSW'
        //         sh 'echo $PSQL_CREDENTIALS_USR'
        //         sh 'PGPASSWORD="$PSQL_CREDENTIALS_PSW" psql -h monitoring-postgres -p 5432 -U $PSQL_CREDENTIALS_USR -d instamailing -c "SELECT current_user, current_database();"'
        //     }
        // }

        // stage('Test backend') {
        //     steps {
        //         dir('backend') {
        //             sh 'npm run test:coverage'
        //         }
        //     }
        // }

        // stage('Dependency Scanning') {

        //     parallel {

        //         stage('NPM Dependencies Audit') {
        //             steps {
        //                 dir('backend') {
        //                 sh '''
        //                     npm audit --audit-level=critical
        //                         echo $?
        //                     '''
        //                 }
        //             }
        //         }

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

        stage('Build docker image'){
            steps{
                sh 'docker build -f Dockerfile -t ludovic/monitoring-site:$GIT_COMMIT .'
            }
        }

        stage("Where i am ?"){
            steps{
                sh 'pwd'
                sh 'ls -la'
            }   
        }

        stage('Trivy scanning'){       
            steps{
                sh '''
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    --name trivy \
                    aquasec/trivy:latest \
                    image ludovic/monitoring-site:$GIT_COMMIT \
                    --severity LOW,MEDIUM \
                    --exit-code 0 \
                    --format json -o trivy-image-MEDIUM-results.json"
                '''
            }
        }

    }
}


