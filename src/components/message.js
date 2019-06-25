createMessage = (text, uid) => {
  return {
  	text: 'Você tem um novo match',
   	createdAt: new Date().getTime(),
      user: {
        _id: uid,
        avatar: null,   // aqui tem que passar o avatar do user
        name: null      // aqui tem que passar o nome do user
      }
  }
}

export default createMessage