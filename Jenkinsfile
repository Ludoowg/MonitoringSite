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

        stage('Dependency Scanning') {

            parallel {

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

                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck ( additionalArguments: '''
                            --scan \'./\'
                            --out \'./\'
                            --format \'ALL\'
                            --prettyPrint ''', odcInstallation: 'OWASP-DepCheck-12',

                        nvdCredentialsId: 'NVD-API-KEY')

                        junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './',
                         reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check Report', 
                         reportTitles: '', useWrapperFileDirectly: true])
                    }
                }
            }
        }       
    }
}
