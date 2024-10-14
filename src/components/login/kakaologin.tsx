import KakaoLoginImg from "../../images/kakao_login.png"
import Cat1 from "../../images/cat_left.jpg"
import Cat2 from "../../images/cat_rigth.jpg"

function KakaoLogin() {
    const client_id = process.env.REACT_APP_REST_API_KEY;
    const redirect_uri = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
    //cors 이슈로 인해 href 방식으로 호출
    const loginKaKao = () => {
      window.location.href = url;
    }
    return (
    <div className="map-wrapper">
      <div className="login-container">
        <img src={Cat1}></img>
        <img src={Cat2}></img>
        <img src={KakaoLoginImg} alt='카카오 로그인' onClick={loginKaKao} /> 
      </div>
    </div>
    );
  }
  
  export default KakaoLogin;