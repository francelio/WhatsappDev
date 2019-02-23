import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class MensagemItem extends Component {
    constructor(props) {
      super(props);
        let bgColor = '#EEEEEE';
        let align='flex-start';
        let txtAlign='left';
       
        if (this.props.data.uid==this.props.me){
            bgColor = '#9999FF';
            align='flex-end';
            txtAlign='right';
        }
    
        this.state = {
          bgColor:bgColor,
          align:align,
          txtAlign:txtAlign,
          dateMsg:this.getFormattedDate(this.props.data.date)
        };
        this.getFormattedDate = this.getFormattedDate.bind(this);
    };  
    getFormattedDate(originalDate){
        // pega a data atual
        let cdate = new Date();
        // acassar data e hora separadamente 
        let mDate = originalDate.split(' ');
        // formatar a data atual em ano mes e dia 
        let todayDate = cdate.getFullYear()+'-'+(cdate.getMonth()+1)+'-'+cdate.getDate();
    //    armazenar hora e minutos com substring
        let newDate = mDate[1].split(':');
        // formatar caso seja menor de 10 contatena com o '0' ANTES
        newDate = ((newDate[0]<10)?'0'+newDate[0]:newDate[0]) +':'+((newDate[1]<10)?'0'+newDate[1]:newDate[1]) ;

        // comparar se hoje é diferente da data da mensagem
        if ( todayDate != mDate[0]){
            // caso a data seja diferente mostrar com data e hora caso contrario somente a hora
            let newDateDays = mDate[0].split('-');
            newDate = newDateDays[2]+'/'+newDateDays[1]+'/'+newDateDays[0]+' '+newDate;
        }

        return newDate;
    }
    render () {
        return (
           
                <View style={[MensagemItemStales.area,{alignSelf:this.state.align,backgroundColor:this.state.bgColor}]}>
                    {this.props.data.msgType == 'text' &&
                        <Text style={{textAlign:this.state.txtAlign}}>{this.props.data.m}</Text>
                    }
                    {this.props.data.msgType == 'image' &&
                         <Text style={{textAlign:this.state.txtAlign}}>imagem</Text>
                        // <Image style={{textAlign:this.state.txtAlign}} source={this.props.data.imgSource} />
                    }
                                        

                    <Text style={MensagemItemStales.dateTxt}>{this.state.dateMsg}</Text>
                </View>
                
        );
    }
}


const MensagemItemStales = StyleSheet.create({
   
    area:{
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:5,
        padding: 10,
        maxWidth:'80%',
        borderRadius:10 ,
    },
    buttonArea:{
        height:50,
        flex:1,
        justifyContent:'center',
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    dateTxt:{
        fontSize:10,
        textAlign:'right'
    }

});