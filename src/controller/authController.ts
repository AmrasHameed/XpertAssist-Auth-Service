import jwt, { Secret } from 'jsonwebtoken'
import "dotenv/config"

export class Authcontroller {

    isAuthenticated = async (call: any, callback: any) => {
        try {
            console.log("Token validating");
            const token = call.request.token || ''; 
            const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN || "AmrasHameed" as Secret);
            callback(null, { userId: decoded.id, role: decoded.role });
        } catch (e: any) {
            console.error("JWT verification error:", e.message);
            callback(e, { message: "Something went wrong in authentication" });
        }
    }
    

    refreshToken = async(call:any, callback:any) => {
        try{
            const refreshtoken = call.request.token as string;
            const decoded: any = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN ||"AmrasHameed" as Secret);
            if(!decoded){
                throw new Error("refresh invalid token  ")
            }
            console.log("token refreshed ");
            const refresh_token = jwt.sign({id: decoded.id, role: decoded.role}, process.env.REFRESH_TOKEN ||"AmrasHameed" as Secret, {
                expiresIn: "7d"
            })
            const access_token = jwt.sign({id: decoded.id, role: decoded.role}, process.env.ACCESS_TOKEN ||"AmrasHameed"as Secret, {
                expiresIn: "15m"
            })
            const response = {access_token, refresh_token}
            callback(null, response)
        }catch(e:any){
            console.log(e);  
            callback(e, {message:"something gone wrong in authentication "})
        }
    }
}