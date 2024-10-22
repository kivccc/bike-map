import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
interface ApiResponse {
  result: {
    user_id: string;
    jwt: string;
  };
}
export function KakaoRedirect() {
  const navigate = useNavigate();
  const code: string | null = new URL(window.location.href).searchParams.get("code");

  console.log(code);



  useEffect(() => {
    const kakaologin= async()=>{
      try{
          
          const res = await axios.get(`/oauth2/oauth2/callback/${code}`);
          console.log(res);
      }
      catch(err){
        console.error(err);
      }
    };
    kakaologin();
    
  }, [code]);

  return <div>로그인 중입니다.</div>;
}


export default KakaoRedirect;
