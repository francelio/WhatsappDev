import React, { Component } from 'react';
import { View, Text, StyleSheet,Button,TextInput,Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { checkLogin,changeEmail,changePassword,changeName,signUpAction } from '../actions/AuthActions';
import LoadingItem from '../components/LoadingItem';

export class SignUp extends Component {

	static navigationOptions = {
		title:'Cadastrar',
	
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
            <Text>Digite seu nome:</Text>
            <TextInput value={this.props.name} onChangeText={this.props.changeName} style={styles.input}/>
            <Text>Digite seu e-mail:</Text>
            <TextInput value={this.props.email} onChangeText={this.props.changeEmail} style={styles.input}/>
            <Text>Digite sua senha:</Text>
            <TextInput secureTextEntry={true} value={this.props.password} onChangeText={this.props.changePassword} style={styles.input}/>
           <Button title="Cadastrar" onPress={ () => {
               this.setState({loading:true});
               this.props.signUpAction(this.props.name,this.props.email,this.props.password,()=>{
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
        name:state.auth.name,
        email:state.auth.email,
        password:state.auth.password,
        status: state.auth.status
    };
};

const SignUpConnect = connect(mapStateToProps, { checkLogin,changeEmail,changePassword,changeName,signUpAction })(SignUp);
export default SignUpConnect;



