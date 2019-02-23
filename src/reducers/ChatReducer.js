const initialState = {
	chats:[],
	contacts:[],
	activeChat:'',
	activeChatTitle:'',
	activeChatMenssages:[],

};

const ChatReducer = (state = initialState, action) => {
	
	if(action.type == 'setContactList') {
		return { ...state, contacts:action.payload.users};
	}
	
	if(action.type == 'setActiveChat') {
		let chatTitle='';
		// varrer  array e encontrar o titulo
		for (var i in state.chats){
			if (state.chats[i].key == action.payload.chatid){
				chatTitle = state.chats[i].title;
			}

		}

		return { ...state, activeChat:action.payload.chatid,activeChatTitle:chatTitle};
	}

	if(action.type == 'setChatList') {
		return { ...state, chats:action.payload.chats};
	}
	
	if(action.type == 'setActiveChatMessage') {
		return { ...state, activeChatMenssages:action.payload.msgs};
	}
	
	
	
	return state;

};

export default ChatReducer;