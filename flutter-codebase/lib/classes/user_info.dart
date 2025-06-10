
class UserInfo {
  String name = '';
  String email = '';
  String userName = '';
  String password = '';
  bool neighborhoodSetup = false;
  bool citySetup = false;
  String cityName = '';
  String neighborhoodName = '';

  UserInfo(this.name, this.email, this.userName, this.password,
      [this.citySetup = false,
      this.neighborhoodSetup = false,
      this.cityName = '',
      this.neighborhoodName = '']);
  String getName() {
    return name;
  }

  String getEmail() {
    return email;
  }

  String getUser() {
    return userName;
  }

  String getPassword() {
    return password;
  }

  bool isCitySetup() {
    return citySetup;
  }

  bool isNeighborhoodSetup() {
    return neighborhoodSetup;
  }
}


