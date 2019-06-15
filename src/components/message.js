createMessage = (text, user) => {
    return {
      createdAt: new Date().getTime(),
      text: text,
      user: user,
    }
  }
  
  export default createMessage