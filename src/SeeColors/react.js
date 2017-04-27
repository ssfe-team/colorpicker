/**
 *
 * Created by suti on 2017/4/7.
 */
class React{
  constructor(){

  }
  define(k,v){
    Object.defineProperty(this,k,{
      value:v,
      set(v){
        this._notify(k,v);
        return v;
      },
      get(){
        this._notify(k,v);
        return v;
      }
    })
  }
  _notify(){

  }

}