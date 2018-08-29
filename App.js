 
import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, YellowBox, Picker, Modal, TouchableHighlight} from 'react-native';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, Icon, DeckSwiper, Left, Image,
      Body, Title, View , Thumbnail, Text, Button, Badge} from 'native-base';      
import { Col, Row, Grid } from 'react-native-easy-grid';
import NumericInput from './components/NumericInput';
import CountDown from './components/CountDown';       

YellowBox.ignoreWarnings(["Warning:"]);
const timeMatch = 1200

const cards = [
  {
    text: 'ครึ่งแรก',
    teamA: 0,
    teamB: 0,
  },  
  {
    text: 'ครึ่งหลัง',
    teamA: 0,
    teamB: 0,
  },
]; 

export default class App extends Component  {

  constructor(props) {    
    super(props);
    this.state = { text: '', initTime: timeMatch , 
                  txtStatus : 'เริ่มการทำงาน',
                   isRestart: false,
                   ip: '172.26.1.168',
                   modalVisible: false,
                   newTime: timeMatch,
                   isBackward: true,
              };
  } 
 
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

 
  handleInputChange = (text) => {
    if (/^\d+$/.test(text)) {
      this.setState({
        text: text
      });
    }
  }
 

  onStart = () => {
    console.log('\n\npress start') 
    this.setState( {txtStatus: 'กำลังแข่งขัน...', isRestart: true})

// axios.get('http://172.20.10.14/ledon')
    axios.get(`http://${this.state.ip}/ledon`)
      .then((response) => {        
        console.log(response);
        this.setState( {txtStatus: 'Start Success' })      
    }) 
    .catch( (error) => {
        console.log(error);
        this.setState( {txtStatus: 'Error occurred' })      
    });
  
      this.setState( {initTime: timeMatch })
      console.log(' status: ' + this.state.txtStatus)
  }

  onPause = () => {
    console.log('press Pause') 
    this.setState( {initTime:0, txtStatus: 'Pause...'}) 
  }
 
  onOff = () => {
    console.log('\n\npress Off') 
    this.setState( {initTime:0, txtStatus: 'ปิดระบบ...', isRestart: false})
      
    axios.get(`http://${this.state.ip}/ledoff`)    
      .then( (response) => {        
        console.log(response);
        console.log(`http://${this.state.ip}/ledoff`)
        this.setState( {txtStatus: 'Shutdown Success' })      
    }) 
    .catch( (error) => {
        console.log(error)
        this.setState( {txtStatus: 'Error occurred' })      
    }) 
  }
 



  render() {
    return (
    <Container>
      <Header>
          <Body style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Title >Scoreboard</Title>
          </Body>
      </Header>
 
      <Content padder>  

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
 
              <Card > 
                <CardItem header bordered 
                    style={{paddingTop: 0, paddingBottom: 0,  marginBottom: 10, 
                          justifyContent: 'center'}}>             
                    <Text style={{ fontSize:25}}>เลือกโหมดการตั้งเวลา</Text>         
                </CardItem>

                <CardItem  style={{paddingTop: 0,
                                    paddingBottom: 0,justifyContent: 'center'}} > 
                    <Grid>
                      <Col>
                        <Text style={{fontSize: 20, alignSelf:'center', marginBottom: 10}}>เวลา</Text>
                        <Button bordered warning style={{alignSelf:'center', marginBottom: 10}}>
                          <Text style={{fontSize: 20}}> {parseInt(this.state.newTime)/60 } นาที</Text>
                        </Button>
                      </Col>
                      <Col>
                        <Text style={{fontSize: 20, alignSelf:'center', marginBottom: 10}}>การจับเวลา</Text>
                        <Button bordered info style={{alignSelf:'center', marginBottom: 10}}>                      
                          <Text style={{fontSize: 20}}> 
                              {(this.state.isBackward)? 'นับถอยหลัง':'นับไปข้างหน้า'}</Text>
                        </Button>
                      </Col>
                      </Grid> 
                  </CardItem> 
  
                <CardItem>  
                  <Grid>
                    <Col>    
                       <Button rounded  warning 
                       style={{marginBottom: 20, alignSelf:'center' }}
                       onPress={() => { this.setState({newTime:720}) }} >
                          <Text>12 นาที</Text>
                       </Button> 
                       <Button rounded  warning
                       style={{marginBottom: 20, alignSelf:'center' }}
                       onPress={() => { this.setState({newTime:1200}) }} >
                          <Text>20 นาที</Text>
                       </Button> 
                       <Button rounded  warning 
                       style={{marginBottom: 20, alignSelf:'center' }}
                       onPress={() => { this.setState({newTime:1800}) }}  >
                          <Text>30 นาที</Text>
                       </Button>      
                     </Col>

                     <Col>                 
                        <Button rounded  info 
                         style={{marginBottom: 20, alignSelf:'center' }}
                         onPress={() => {
                            this.setState({isBackward:false})
                          }} >
                            <Text>นับไปหน้า</Text>
                         </Button>   
                         <Button rounded  info 
                         style={{ alignSelf:'center' }}
                         onPress={() => {
                           this.setState({isBackward:true})
                          }} >
                            <Text>นับถอยหลัง</Text>
                         </Button>   
                        </Col>
                    </Grid>  
                </CardItem>
 

                <CardItem footer style={{ alignSelf:'center' }} >
                  <Button iconLeft      
                    style={{marginBottom: 10}}              
                    onPress={() => {
                     this.setModalVisible(!this.state.modalVisible);
                     }} 
                    >
                    <Icon name='home' />
                    <Text>ตกลง</Text>
                  </Button>
                </CardItem>
             </Card>
  
          </Modal>
  
        <Card>
          <CardItem header bordered style={{paddingTop: 0, paddingBottom: 0,justifyContent: 'center'}}>             
              <Text style={{ fontSize:25}}>เวลา</Text>         
          </CardItem>
          <CardItem bordered >
            <Body  style={{alignItems : 'center' }}>
                <CountDown
                    until={this.state.initTime}
                    onFinish={() => console.log('finished')}
                    onPress={() =>   this.setModalVisible(!this.state.modalVisible) }
                    isRestart={this.state.isRestart}
                    timeToShow={['M', 'S']}
                    labelM='นาที'
                    labelS='วินาที'
                    size={45}
                /> 
            </Body>
          </CardItem>
        </Card>

        <View style={{minHeight: 150}} >
        <DeckSwiper
          dataSource={cards}
          renderItem={item =>
              <Card style={{ elevation: 2 }}> 
                <CardItem header bordered 
                    style={{paddingTop: 0, paddingBottom: 0, 
                          justifyContent: 'center'}}>             
                    <Text style={{ fontSize:25}}> { item.text} </Text>         
                </CardItem>

                <CardItem bordered>
                  <Body> 
                    <Grid> 
                        <Col>
                            <Text style={{fontSize:25, marginBottom: 0, textAlign:'center' }}>TeamA</Text>
                            <View style={{borderWidth: 1, alignItems : 'center',justifyContent: 'center', alignSelf:'center' }}/>
                              <NumericInput 
                                
                                minValue={0} 
                                rounded 
                                textColor='#B0228C'
                                iconStyle={{ color: 'white' }} 
                                rightButtonBackgroundColor='#EA3788' 
                                leftButtonBackgroundColor='#E56B70'
                                onChange={value => console.log(value)}  />            
                            </View>
                        </Col>
                        <Col>
                            <Text style={{fontSize:25, marginBottom: 0, textAlign:'center' }}>TeamB</Text>
                            <NumericInput 
                              style={{alignItems : 'center' ,justifyContent: 'center'}}
                              minValue={0} 
                              rounded 
                              textColor='#B0228C'
                              iconStyle={{ color: 'white' }} 
                              rightButtonBackgroundColor='#0000FF' 
                              leftButtonBackgroundColor='#4060FF'
                              onChange={value => console.log(value)}  />   
                        </Col>
                    </Grid> 

                  </Body>
                </CardItem>
              </Card>   
            }
          /> 
        </View>

       <Card> 
         <CardItem bordered >
            <Body>
             <Grid style={{marginBottom: 10}}>
                <Col style={{ alignItems: 'center'}}> 
                  <TouchableOpacity onPress={this.onStart} > 
                      <Thumbnail source={require('./images/play.png')} />  
                   </TouchableOpacity>
                </Col>
                <Col style={{ alignItems: 'center'}}>
                  <TouchableOpacity
                      onPress={this.onPause}>
                     <Thumbnail source={require('./images/pause.png')} />
                   </TouchableOpacity>
                </Col>
                <Col style={{ alignItems: 'center'}}>                   
                  <TouchableOpacity
                      onPress={this.onOff}>
                      <Thumbnail source={require('./images/stop.png')} />
                   </TouchableOpacity>                      
                </Col>
              </Grid>

              <Grid style={{marginTop: 10}} >                     
                <Col>
                  <TouchableOpacity style={styles.banner} >                       
                     <Thumbnail source={require('./images/char.jpg')} />                      
                  </TouchableOpacity>                     
                </Col>
                <Col>
                  <Row>
                    <Text style={{backgroundColor:'gold'}}> 
                          IP: {this.state.ip} {'\n'} 
                          Status: {this.state.txtStatus}
                    </Text>
                  </Row>
                  <Row >
                    <TextInput
                      style={{borderColor: 'gray', borderWidth: 1}}
                      onChangeText={(ip) => this.setState({ip})}
                      value={this.state.ip} />
                  </Row>
                </Col>
              </Grid>

             </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>            

    );
  }
} 

const styles = StyleSheet.create({ 
  banner : {
    borderWidth:0,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    borderRadius:100,
    marginTop: 12, 
  }
});