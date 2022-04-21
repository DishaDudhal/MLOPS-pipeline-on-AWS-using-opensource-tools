import * as pulumi from '@pulumi/pulumi';
import * as awsx from '@pulumi/awsx';
import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import TraefikRoute from './TraefikRoute';

//Build and Push Docker image
const repo = new awsx.ecr.Repository("my-model");
const appImage = repo.buildAndPushImage(`../`);

//Connect to the previously created infrastructrue 
//Read base Pulumi projects
const config = new pulumi.Config();
const baseStack = new pulumi.StackReference('DishaDudhal/ml-infra/dev')

const provider = new k8s.Provider('provider', {
  kubeconfig: baseStack.requireOutput('kubeconfig'),
})

// const image = awsx.ecr.buildAndPushImage('{{cookiecutter.project_slug}}-image', {
//   context: '../',
// });

const pb = new kx.PodBuilder({
    containers: [{
        image: appImage,
        ports: {"http": 80},
        env: {
            "MLFLOW_TRACKING_URI": "http://a3157ff74eea1473ea35353d2d9e1886-1998414389.us-west-2.elb.amazonaws.com/mlflow",
            'MLFLOW_RUN_ID': config.require('runID'),
        },
    }],
    serviceAccountName: baseStack.getOutput('modelsServiceAccount'),
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

const deployment = new kx.Deployment('app-kx', {
  spec: pb.asDeploymentSpec() 
}, { provider: provider });

const service = deployment.createService();


// Expose model in Traefik 
new TraefikRoute('my-model-route', {
  prefix: '/models/my-model',
  service: service,
  namespace: 'default',
}, { provider: provider });