// /*!
//  * Copyright 2023, Staffbase GmbH and contributors.
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import React, { ReactElement } from "react";
// import { BlockAttributes } from "widget-sdk";

// /**
//  * React Component
//  */
// export interface WeatherWidgetProps extends BlockAttributes {
//   message: string;
// }

// export const WeatherWidget = ({ message, contentLanguage }: WeatherWidgetProps): ReactElement => {
//   return <div>Hello {message} {contentLanguage}</div>;
// };



/*!
 * Copyright 2023, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { COUNTRY_CODE } from "./isoCountryCode";
import React, { ReactElement, useEffect, useState } from "react";
import { BlockAttributes, SBUserProfile, WidgetApi } from "widget-sdk";

/**
 * React Component
 */


export interface WeatherWidgetProps {
  message: string;
  _widgetApi: WidgetApi;

}


// export interface WeatherWidgetProps extends BlockAttributes {
//   message: string;
// }

export const WeatherWidget = ({ message, _widgetApi }: WeatherWidgetProps): ReactElement => {

  // console.log(message)

  const [user, setUser] = useState<SBUserProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState('')
  // const [location, setLocation] = useState({ lat: 0, lon: 0 })
  const [weather, setWeather] = useState({
    location: '',
    temp: 0,
    feelslike: 0,
    maxTemp: 0,
    minTemp: 0,
  })

  const locationPosition = async (arr = 'Kolkata') => {
    const locations = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${arr}&limit=5&appid=1d13ce9ad6d71637b38a1dfe97a0c3ab`)
    const res = await locations.json();
    return res.map((arr: []) => {
      return {
        value: { lat: arr.lat, lon: arr.lon },  // we are giving value as js Object
        label: `${arr.name},${arr.country}`
      }
    });
  }

  useEffect(() => {
    _widgetApi.getUserInformation()
      .then(user => user.location)
      .then(userLocation => {
        // console.log(x)
        const unspacedLocation = 'london,us' // userLocation.toLowerCase().replaceAll(' ', '');   // kolkata,india
        
        const str1 = unspacedLocation.substring(0, unspacedLocation.indexOf(','))     //   kolkata
        console.log("llllllllllllllllll",str1)
        const str2 = unspacedLocation.substring(unspacedLocation.indexOf(',') + 1).toUpperCase()   //   india
        console.log(str2)
        const str = COUNTRY_CODE[str2]                         //   IN
        console.log("code is----------------------",str)
        const reformedLabel = str1 + ',' + str.toLowerCase()     //  kolkata,in
        console.log(reformedLabel);
        locationPosition(str1)
          .then(res => {
            res.map(p => {
              if (reformedLabel == p.label.toLowerCase()) {  //  p.label.toLowerCase() is   kolkata,in
                // setLocation(p.value)
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${p.value.lat}&lon=${p.value.lon}&appid=1d13ce9ad6d71637b38a1dfe97a0c3ab`)
                  .then(res => res.json())
                  .then(res => setWeather({ location: p.label, temp: res.main.temp, feelslike: res.main.feels_like, maxTemp: res.main.temp_max, minTemp: res.main.temp_min }))
              } else
                setErrorMsg("Write Proper city,country  format")
            })
          }
          )
      })
  }, []);


  // if (user?.location) {

  //   const x = '   KolkAt   a , In'//user?.location
  //   const str = x.toLowerCase().replaceAll(' ', '');
  //   const str1 = str.substring(0, str.indexOf(','))
  //   console.log(str1);
  //   locationPosition()
  //     .then(res => {
  //       res.map(p => {
  //         if (str == p.label.toLowerCase()) {
  //           setLocation(p.value)
  //           fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${p.value.lat}&lon=${p.value.lon}&appid=1d13ce9ad6d71637b38a1dfe97a0c3ab`)
  //             .then(res => res.json())
  //             .then(res => setWeather({ location: p.label, temp: res.main.temp, feelslike: res.main.feels_like, maxTemp: res.main.temp_max, minTemp: res.main.temp_min }))
  //         }
  //       })
  //     }
  //     )

  // }


  if (errorMsg == '') {
    return <h1 style={{ fontSize: '25px' }}>{weather.location}, {Math.round(weather.temp - 273.15)}°C</h1>;
  }
  else
    return <h1>{errorMsg}</h1>
};

