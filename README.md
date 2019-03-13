### Call Centre Call Analysis Application

 #Purpose
 Companies who deals with thousands of consumers every day, costumer satisfaction is very important. Costumers every interaction with the company can tell a lot about his/her thoughts toward it. Is is satisfied with the work? Is he angry? Is he will to pay for the service? Etc. Question arises how can you monitor the interactions?
 Companies who provide assistance or other services on call, tends to record the conversations. In order to monitor costumer interaction with the company and working of call center department ,  those recording can be analyzed.
 
 That is where this application can come into play. This application analyses those recording an makes a report about all the calls.
 The data from this application can be used and visualized using different visualization software.
 
 ##Working
 Step1: Get the recordings in .mp3 format. Run them through services which convert audio to text eg: Aamzon Transcribe. Audio converted to text is in .json file.
Step2: Those json files will be input to application.js which will analyze those files can create an .csv to store the data of analysis.
Step3: The output given by application.js in step2 can visualized using visualization software.

##My work
My work here accounts for the Step2 of the working process of the application.
I wrote a Node.js code to analyses the json file of audio.
     Files & Folders present
1.jsonfiles: It contains some json file which are received after audio files are ran through amazon transcribe.
2.application.js: It is the code which I wrote to analyses the calls.
3.Output.csv: As the name specifies is the output from application.js
4.nodejs_modules: All the modules required to run the code

