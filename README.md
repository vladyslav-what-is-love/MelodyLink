# MelodyLink
This project is made to help young talanted musicians find events, organizers, producers, labels, etc

When designing my system, I decided that I needed such actors as a regular, unauthorised user, a musician (who can also represent a band), an organiser (who can be a producer or a label) and an administrator. 

- First option (the view of an unauthorised user): he/she can view all musicians and organisers with the ability to filter both by the criteria as described above, can go to each profile for review, and has added functionality for creating a profile, but it is worth noting that the profile must be created with a given role in the system, among the options offered are "musician/group" and "organiser/label/producer".

- Since an authorised user can be either an organiser or a musician, their functionality is similar. A musician can edit his or her profile (or delete it) if necessary, add genres or instruments to the system if they are not there, view and filter all organisers by the necessary criteria, visit the profile of each administrator and, if he or she would like to work with them, send a request for cooperation. The organiser, in turn, can also edit or delete his profile and add the company he works for if it is not among the proposed ones, view and filter the musicians he needs, go to each profile and send them requests for cooperation if he finds the right candidate.

- The next actor in the system is the administrator. He or she can view and filter all musicians and organisers available in the system and delete any profile of both the organiser and the musician at his or her discretion.

Project written using Node.js (express framework)

A PostgreSQL database is used to store information


