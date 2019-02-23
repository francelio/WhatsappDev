import React, { Component } from 'react';
import { View, Text, StyleSheet,Button,TextInput,Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { checkLogin,changeEmail,changePassword,signInAction } from '../actions/AuthActions';
import LoadingItem from '../components/LoadingItem';

export class SignIn extends Component {

	static navigationOptions = {
		title:'Login',
	
	}

	constructor(props) {
		super(props);
		this.state = {
      loading:false,
    };

    }
    //função nativa executada ao atualizar alguma informação na tela
    componentDidUpdate() {
      if(this.props.status == 1){
        Keyboard.dismiss();
        this.props.navigation.navigate('Conversas');
      }
    }
	render() {
		return (
			<View style={styles.container}>
            <Text>Digite seu e-mail:</Text>
            <TextInput value={this.props.email} onChangeText={this.props.changeEmail} style={styles.input}/>
            <Text>Digite sua senha:</Text>
            <TextInput secureTextEntry={true} value={this.props.password} onChangeText={this.props.changePassword} style={styles.input}/>
           <Button title="Entrar" onPress={ () => {
                this.setState({loading:true});
               this.props.signInAction(this.props.email,this.props.password,()=>{
                this.setState({loading:false});
               });
           } }/>
           <LoadingItem visible={this.state.loading} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1,
		margin:10,
		justifyContent:'center',
		alignItems: 'center',
    },
    input:{
        height:50,
        fontSize: 23,
        width:'80%',
        backgroundColor:'#DDDDDD'
    }
});

const mapStateToProps = (state) => {
	return {
        uid:state.auth.uid,
        email:state.auth.email,
        password:state.auth.password,
        status: state.auth.status
        
    };
};

const SignInConnect = connect(mapStateToProps, { checkLogin,changeEmail,changePassword,signInAction })(SignIn);
export default SignInConnect;



