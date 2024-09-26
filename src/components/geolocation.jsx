import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import CustomGeoMarker from "../images/geomarker.png"
export default function GetGeoLocation(){
    const [state, setState] = useState({
        center: {
          lat: 33.450701,
          lng: 126.570667,
        },
        errMsg: null,
        isLoading: true,
      })

    const RefreshGeoLocation = () =>{

        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setState((prev) => ({
                  ...prev,
                  center: {
                    lat: position.coords.latitude, // 위도
                    lng: position.coords.longitude, // 경도
                  },
                  isLoading: false,
                }))
              },
              (err) => {
                setState((prev) => ({
                  ...prev,
                  errMsg: err.message,
                  isLoading: false,
                }))
              }
            )
          } else {
            // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            setState((prev) => ({
              ...prev,
              errMsg: "geolocation을 사용할수 없어요..",
              isLoading: false,
            }))
          }
    }
    
    useEffect(() => {
        RefreshGeoLocation();
    }, [])

    const tmp = () => {
        console.log(state);
    };
      return (
        <>
        {!state.isLoading && (
            <MapMarker  
                position={{
                lat: state.center.lat,
                lng: state.center.lng,
                }}
                image={{
                src:CustomGeoMarker,
                size: {
                    width: 24,  // 이미지의 너비
                    height: 24, // 이미지의 높이
                  },
                }}
            >
                <div style={{ padding: "5px", color: "#000" }}>
                  {state.errMsg ? state.errMsg : "사용자의 위치"}
                </div>
            </MapMarker>
        )}
        </>
      )
}