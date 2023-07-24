stage('Frontend Lighthouse Performance Tests') {
  agent {
    label 'master'
  }
  when {
    branch 'master'
  }
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