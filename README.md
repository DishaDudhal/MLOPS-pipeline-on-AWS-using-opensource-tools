# ML-OPS Pipeline from Scratch using open-source tools 
This is a ML-OPS Pipeline template with Github Actions for ML related projects.

<hr>
<h1> Open Source Tools Used to setup the pipeline </h1>
1. Pulumi - infrastructre deployment.<br/>
2. MLFlow - ML pipeline.  <br/>
3. Trafeik - Reverse proxy and Load balancing.<br/>  
4. Aporia - ML pipeline montiroing.<br/>  
5. Poetry - dependency management and packaging.<br/>   
6. Github Actions - CI/CD.<br/>  
7. AWS(S3, RDS and EKS) - Cloud provider and infrasturcture deployment.<br/>  
8. Cookiecutter - A cross-platform command-line utility that creates projects from project templates mentioned in the cookicutter slug.<br/>
9. DVC Storage - Model versioning.<br/>
10. Fast API - Model Serving.<br/>  

<hr>
<h1>Steps to start an ML-Ops pipeline for your ML model</h1>
To use this project, clone the repository in the following manner:
1. Clone/Fork this repository, note that any of your ML model secrets need to be configured as Secrets into your organizations Github Account. If you dont have an 
organization but have a personal account then you need to manually add certain secrets. <br/>
2. To add secrets, go to your forked Repository -> Settings -> Actions -> Secrets. Give each environment variable a name and add the secret value.<br/>
3. What are github secrets? A brief explanation would be - your AWS IAM credentials, S3 access credentials, your Kubernetes cluster access credentials etc.
Any secrets/ passwords which are a sensitive information is stored under Secrets.<br/>
4. Once these secrets are configured, your model template is enabled to use your AWS account to spawn a cluster for your ML model.<br/>
5. Now open a shell/terminal/command prompt (deoending on what OS you are working with).<br/>
6. Type the following command to start the ML-OPS pipeline for your project - "python -m cookiecutter <github-url-of-this-model-template-repository-forked-to-your-account/model-template>". <br/>
7. Next you will be prompted to enter details such as your name/project name etc.<br/>
8. And after adding all details your pipeline should start. You can check the status of your pipeline under your Repositories Actions tab"<br/>

<hr>
<h2> Things to keep in Mind </h1>
The github secrets needed for this project are :
1. ![image](https://user-images.githubusercontent.com/46836289/172740173-1fffa02c-9d7b-4f68-b033-be726c647f55.png)
2. As you see in the above image, you need to configure the following secret into your forked Github repo secrets. 
3. Please be careful with the naming conventions, as these are environment variables and they are used in your Pipeline.
4. You are free to modify the code in, to incorporate the database of your choice. In this project we have used RDS - t3 medium

If you have any queries regarding this project please contact the person on their specified email ID.

<hr> 
<h1> Referrences </h1>
https://www.aporia.com/blog/building-an-ml-platform-from-scratch/
