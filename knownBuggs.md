## Chat app frontend - known buggs and drawbacks

 - Chat room is not deleted after failed insert to ismember table (you can fill nonsence to field emails)
 - Validation of created chat rooms is not finished.
 - No prevention against sqlInjection
 - Message window scroll not always jump to bottom corner, after the click to a chat 
 - There is no information of users that are members of selected chat
 - There is no way to delete chat rooms and messages
 - Absence of HTTP 2.0
 - Absence of responsive design
 - No way to detect if user has already seen message (unread status)
 - Password are stored as plain text into DB
 