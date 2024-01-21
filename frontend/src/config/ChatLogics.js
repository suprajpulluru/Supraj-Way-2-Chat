export function getSenderFull(loggedUser, users) {
  return (
    loggedUser &&
    Array.isArray(users) &&
    users.length === 2 &&
    users[0]._id === loggedUser._id ? users[1] : users[0]
  );
};

export function isSameSender(messages,m,i,userId) {
  return (
    (i < messages.length -1) && 
    (messages[i+1].sender._id !== m.sender._id || messages[i+1].sender._id === undefined) &&
    (messages[i].sender._id !== userId)
  );
};
//messages -- messages array, m -- current message, i -- index of current message, userId -- Id of logged in user.

export function isLastMessage(messages,i,userId) {
  return (
    (i === messages.length -1) &&
    (messages[i].sender._id !== userId) &&
    (messages[i].sender._id !== undefined)
  );
};

export function isSameSenderMargin(messages,m,i,userId) {
  if( 
    i < messages.length - 1 && 
    messages[i+1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )return 33;
  if(
    (i < messages.length - 1 && messages[i+1].sender._id !== m.sender._id && messages[i].sender._id !== userId) ||
    (i === messages.length -1 && messages[i].sender._id !== userId)
  )return 0;
  return "auto";
};

export function isSameUser(messages,m,i) {
  return i > 0 && messages[i-1].sender._id === m.sender._id;
};