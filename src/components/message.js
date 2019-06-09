createMessage = (text, sendId, receiveId) => {
  return {
    messenge: text,
    receive: receiveId,
    send: sendId,
    timestamp: new Date().getTime()
  }
}

export default createMessage