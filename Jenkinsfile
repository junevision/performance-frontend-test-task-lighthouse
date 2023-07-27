pipeline {
  agent any
  options {
    // Only keep the 10 most recent builds
    buildDiscarder(logRotator(numToKeepStr:'10'))
  }
  stages {
    stage ('Pull Latest Code') {
      steps {
        git branch: 'master',
        url: 'https://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@github.com/junevision/performance-frontend-test-task-lighthouse.git'
      }
    }
    stage ('Configure') {
      steps {
        sh "mkdir $WORKSPACE/$BUILD_NUMBER"
      }
    }
    stage ('Run Test') {
      steps {
        sh "cd /usr/local/bin"
        sh "/usr/local/bin/node shopping.js"
        sh "mv user-flow_report.html $WORKSPACE/$BUILD_NUMBER/"
      }
    }
    stage ('Publish Test Result') {
      steps {
        archiveArtifacts artifacts: "$BUILD_NUMBER/user-flow_report.html"
      }

      post {
        success {
          // publish html
          publishHTML target: [
              allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: "$WORKSPACE/$BUILD_NUMBER/",
              reportFiles: "user-flow_report.html",
              reportName: "Lighthouse Performance Report"
            ]
        }
      }
    }
  }
}
