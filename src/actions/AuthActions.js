import firebase from '../FirebaseConnection';

export const signOut=()=>{
	firebase.auth().signOut();
	return{
		type:'changeStatus',
		payload:{
			status:2
		}
	};
};
export const checkLogin = () => {

	return (dispatch) => {

		firebase.auth().onAuthStateChanged((user)=>{
			//status:0 não verificado
			//status:1 usuario logado
			//status:2 nenhum usuario logado
	
				if(user) {
					dispatch({
						type:'changeUid',
						payload:{
							uid:user.uid
						}
					});
				} else {
					dispatch({
						type:'changeStatus',
						payload:{
							status:2
						}
					});
				}
			});	


	}

};

export const signUpAction = (name,email,password,callback) =>{
//redux thunk
	return (dispatch) => {
		firebase.auth().createUserWithEmailAndPassword(email,password)
		.then((user) =>{
				let uid= firebase.auth().currentUser.uid;
				//cadastrando no servidor
				firebase.database().ref('users').child(uid).set({
					name:name
				});
				callback();
				dispatch({
					type:'changeUid',
					payload:{
						uid:uid
					}
				});
		})
		.catch((error)=>{
			switch (error.code) {
				case 'auth/email-already-in-use':
						alert('Email ja cadastrado');
					break;
				case 'auth/invalid-email':
					alert('Email invalido');
					break;
				case 'auth/operation-not-allowed':
					alert('Tente novamente mais tarde');
					break;
				case 'auth/weak-passwprd':
					alert('Digite uma senha melhor!');
					break;
				default:
					alert(error.code);
					break;
			}
			callback();
		});
	};
}


export const signInAction = (email,password,callback) =>{
	//redux thunk
		return (dispatch) => {
			firebase.auth().signInWithEmailAndPassword(email,password)
			.then((user) =>{
				let uid= firebase.auth().currentUser.uid;
				callback();
				dispatch({
						type:'changeUid',
						payload:{
							uid:uid
						}
				});
			})
			.catch((error)=>{
				switch (error.code) {
					case 'auth/invalid-email':
						alert('Email inválido');
						break;
					case 'auth/user-disable':
						alert('Seu usuário está desativado!');
						break;
					case 'auth/user-not-found':
						alert('Usuário não encontrado');
						break;
					case 'auth/operation-not-allowed':
						alert('Tente novamente mais tarde');
						break;
					case 'auth/wrong-password':
						alert('E-mail e/ou senha inválido!');
						break;
					default:
						alert(error.code);
						break;
				}
				callback();
			});
		};
	}


export const changeEmail= (email) => {
	return{
		type:'changeEmail',
		payload:{
			email:email
		}
	};

}

export const changePassword= (password) => {
	return{
		type:'changePassword',
		payload:{
			password:password
		}
	};

}
export const changeName= (name) => {
	return{
		type:'changeName',
		payload:{
			name:name
		}
	};

}