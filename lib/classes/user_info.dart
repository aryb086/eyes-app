
class UserInfo{
  String name = '';
  String email = '';
  String userName = '';
  String password = '';
  UserInfo(this.name, this.email, this.userName, this.password);
  String getName(){
    return name;
  }
  String getEmail(){
    return email;
  }
  String getUser(){
    return userName;
  }
  String getPassword(){
    return password;
  }
}