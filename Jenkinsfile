pipeline {

    agent any

    stages {
        stage('Frontend Lighthouse Performance Tests') {

            steps {
                deleteDir()
                checkout scm
                sh 'npm install'
                sh 'npm run lighthouse'
                }

        post {
            always {
                publishHTML (target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'lighthouse-report.html',
                    reportName: "Lighthouse"
                        ])
                    }
            }
        }
    }
}