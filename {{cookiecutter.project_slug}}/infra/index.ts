import * as pulumi from '@pulumi/pulumi';
import * as awsx from '@pulumi/awsx';
import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import TraefikRoute from './TraefikRoute';


//Connect to the previously created infrastructrue 
//Read base Pulumi projects
const config = new pulumi.Config();
const baseStack = new pulumi.StackReference(config.require('baseStackName'));

const provider = new k8s.Provider('provider', {
  kubeconfig: baseStack.requireOutput('kubeconfig'),
})

//Build and push docker image
const image = awsx.ecr.buildAndPushImage('{{cookiecutter.project_slug}}-image', {
  context: '../',
});

const pb = new kx.PodBuilder({
    containers: [{
        image: image.imageValue,
        ports: {"http": 80},
        env: {
            'LISTEN_PORT': '80',
            "MLFLOW_TRACKING_URI": "http://a3157ff74eea1473ea35353d2d9e1886-1998414389.us-west-2.elb.amazonaws.com/mlflow",
            'MLFLOW_RUN_ID': config.require('runID'),
        },
    }],
    serviceAccountName: baseStack.requireOutput('modelsServiceAccount'),
});

// const podBuilder = new kx.PodBuilder({
//   containers: [{
//     image: image.imageValue,
//     ports: { http: 80 },
//     env: {
//       'LISTEN_PORT': '80',
//       'MLFLOW_TRACKING_URI': baseStack.requireOutput('mlflowTrackingURI'),
//       'MLFLOW_RUN_ID': config.require('runID'),
//     }
//   }],
//   serviceAccountName: baseStack.requireOutput('modelsServiceAccountName'),
// });

const deployment = new kx.Deployment('{{cookiecutter.project_slug}}-serving', {
  spec: pb.asDeploymentSpec({replicas : 3}) 
}, { provider });

const service = deployment.createService();


// Expose model in Traefik 
new TraefikRoute('{{cookiecutter.project_slug}}', {
  prefix: '/models/{{cookiecutter.project_slug}}',
  service,
  namespace: 'default',
}, { provider, dependsOn: [service] });