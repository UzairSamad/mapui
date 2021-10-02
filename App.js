
import React, { useState ,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  View
} from 'react-native';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'


const vw = Dimensions.get("window").width
const vh = Dimensions.get("window").height


const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [markers, setMarkers] = useState([]);
  const [data,setData]  = useState([])
  const [connectorLocations,setConncetorLocations]  = useState([])


  useEffect(() => {
    axios
      .get(`https://chargepoints.dft.gov.uk/api/retrieve/type?format=json`)
      .then(response => {
        setData(response?.data?.ConnectorType)
      })
      .catch(error => {
        console.log(error,'ressssssssss')
      });

}, [])
  useEffect(() => {
    axios
      .get(`https://chargepoints.dft.gov.uk/api/retrieve/registry/limit/50/?format=json`)
      .then(response => {
        console.log(response,'locaaationnn')
        setConncetorLocations(response?.data?.ChargeDevice)
      })
      .catch(error => {
        console.log(error,'ressssssssss')
      });

}, [])


let handleChange=(itemValue)=>{
  let markers = []
  connectorLocations.map(value=>{
    if(value.Connector){
     return value.Connector.map(con=>{
        if(con.ConnectorType == itemValue){
          markers.push({lat:value.ChargeDeviceLocation.Latitude , long:value.ChargeDeviceLocation.Longitude})

        }
      })
    }
  })
setMarkers(markers)
setSelectedLanguage(itemValue)
}


let keys = Object.keys(data)
  return (
      <View
        style={{paddingVertical:15,backgroundColor:'pink',flex:1}}
      >
        <Text style={{ fontSize: 22 ,textAlign:'center',marginBottom:vh*0.02}}>Find Your Charge Point</Text>
        <Picker
        style={{marginBottom:vh*0.08}}
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            handleChange(itemValue)
          }>
            {keys.map(val=> <Picker.Item key={data[val]?.ConnectorTypeID} label={data[val]?.ConnectorType} value={data[val]?.ConnectorType} />)}
        </Picker>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{width: vw * 0.95,height: vh * 0.7,marginLeft:8}}
          region={{
            latitude: 52.554362,
            longitude: -1.382325,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
        >
         {markers.length>0 &&   markers.map((val, index) => {
                        return (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: parseInt(val?.lat),
                                    longitude: parseInt(val?.long)
                                }}
                            />
                        )
                })
                }
                </MapView>
      </View>
  );
};



export default App;
