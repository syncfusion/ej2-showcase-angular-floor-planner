#!groovy

node('EJ2Node20') {
    try {
        deleteDir()

        stage('Import') {
            git url: 'http://github.com/essential-studio/ej2-groovy-scripts.git', branch: 'master', credentialsId: env.GithubCredentialID;
            shared = load 'src/shared.groovy'
        }

        stage('Checkout') {
            checkout scm
            shared.getProjectDetails()
            shared.gitlabCommitStatus('running')
        }

        stage('Install') {
            sh 'npm i -g gulp@^4.0.2'
            sh 'npm install'
        }

        stage('Build') {
            sh 'gulp hide-license && npm run build && gulp finished'
        }

        stage('Publish') {
            shared.publish()
        }

        shared.gitlabCommitStatus('success')

        deleteDir()
    }
    catch(Exception e) {
        shared.throwError(e)
        deleteDir()
        error('Build Failed')     
    }
}
