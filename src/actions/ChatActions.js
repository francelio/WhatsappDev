import firebase from '../FirebaseConnection';

export const getContactList = ( userUid ,callback) => {

	return (dispatch) => {

		firebase.database().ref('users').orderByChild('name').once('value').then((snapshot)=>{
			let users = [];

			snapshot.forEach((childItem)=>{
				//não add o usuario logado na lista
				if ( childItem.key != userUid ){
					users.push({
						key:childItem.key,
						name:childItem.val().name
					});
				}


			});
			callback();
			dispatch({
				type:'setContactList',
				payload:{
					users:users
				}
			});
	
		});
		
	

	}

};


export const getChatList = ( userUid,callback ) => {

	return (dispatch) => {

		
		
		//firebase.database().ref('users').Child(userUid).child('chats').on('value',()=>{});
		firebase.database().ref('users').child(userUid).child('chats').on('value',(snapshot)=>{
			let chats = [];

			snapshot.forEach((childItem)=>{
				chats.push({
						key:childItem.key,
						title:childItem.val().title,
						other:childItem.val().other,
					});
			});
			callback();
			dispatch({
				type:'setChatList',
				payload:{
					chats:chats
				}
			});
		});
		

	

	}

};

export const createChat=(userUid1,userUid2)=> {
	return (dispatch) => {
		//Criando o próprio chat
		let newChat = firebase.database().ref('chats').push();


		//criar registro usuario1 no chat
		newChat.child('members').child(userUid1).set({
			id:userUid1
		});
		//criar registro usuario2 no chat
		newChat.child('members').child(userUid2).set({
			id:userUid2
			
		});


		//associando aos envolvidos 
		let chatId = newChat.key;

		// pegar nome  do userUid1
		firebase.database().ref('users').child(userUid2).once('value').then((snapshot)=>{
			//associando usuario1 no chat
			firebase.database().ref('users').child(userUid1).child('chats')
			.child(chatId).set({
				id:chatId,
				title:snapshot.val().name,
				other:userUid2
			});
	
		});
		
		// pegar nome  do userUid2
		firebase.database().ref('users').child(userUid1).once('value').then((snapshot)=>{
				//associando usuario2 no chat
				firebase.database().ref('users').child(userUid2).child('chats')
				.child(chatId).set({
					id:chatId,
					title:snapshot.val().name,
					other:userUid1
				}).then(()=>{
					// depois de criar todos os envolvidaos no chat ele executa o thank
					dispatch({
						type:'setActiveChat',
						payload:{
							chatid:chatId,
						}
					});

				});	
	
		});

	};
};


export const setActiveChat=(chatId)=>{
	return{
		type:'setActiveChat',
		payload:{
			chatid:chatId
		}
	};
};

export const sendImage = (Blob,progressCallback,successCallback)=>{
	return (dispatch) => {
		// gerar uma chave no firebase
		
		let tmpKey = firebase.database().ref('chats').push().key;
		// preparando a referencia da imagem 
		let fbimage = firebase.storage().ref().child('images').child(tmpKey);	
		// enviando a imagem para o firebase
		fbimage.put(Blob,{ contentType:'image/jpeg'}).on('state_changed',
		progressCallback,
		(error)=>{
			//error
			alert(error.code);
		},
		()=>{
			// success
			fbimage.getDownloadURL().then((url)=>{
				successCallback( url );
			});
			
		})
			
	}
};


export const sendMenssage = (msgType, msgContent,author,activeChat ) => {

	return (dispatch) => {

		let currentDate='';
		let cDate = new Date();
		//YYYY-MM-DD HH:II:SS
		currentDate = cDate.getFullYear()+'-'+(cDate.getMonth()+1)+'-'+cDate.getDate();
		currentDate+= ' ';
		currentDate+= cDate.getHours()+':'+cDate.getMinutes()+':'+cDate.getSeconds();

		let msgId = firebase.database().ref('chats').child(activeChat).child('messages').push();
		
		switch(msgType){
			case 'text':
				msgId.set({
					msgType:'text',
					date:currentDate,
					m:msgContent,
					uid:author
				});
				break;
			case 'image':
				msgId.set({
					msgType:'image',
					date:currentDate,
					imgSource:msgContent,
					uid:author
				});
				break;	

		}
		

	}

};

export const monitorChat=(activeChat)=>{
	return(dispatch)=>{
		firebase.database().ref('chats').child(activeChat).child('messages').orderByChild('date').on('value',(snapshot)=>{
			let arrayMsg = [];
			snapshot.forEach((childItem)=>{
				
				switch(childItem.val().msgType){
					case 'text':
						arrayMsg.push({
							key:childItem.key,
							date:childItem.val().date,
							msgType:'text',
							m:childItem.val().m,
							uid:childItem.val().uid
						});
				
						break;
					case 'image':
						arrayMsg.push({
					
						key:childItem.key,
						date:childItem.val().date,
						msgType:'image',
						imgSource:childItem.val().imgSource,
						uid:childItem.val().uid
						});
					break;	
		
				}
				
				
				
			});

			dispatch({
				type:'setActiveChatMessage',
				payload:{
					'msgs':arrayMsg,
				}
			});



		});

		




	};
}; 
export const monitorChatOff=(activeChat)=>{
	return(dispatch)=>{
		firebase.database().ref('chats').child(activeChat).child('messages').off();
	};
};
