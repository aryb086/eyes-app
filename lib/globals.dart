library global;

import 'package:congressional_app/classes/neighborhood_info.dart';

import 'classes/user_info.dart';
import 'classes/city_info.dart';

String username = '';
String zipCode = '';

var users = <String, UserInfo>{};
var cities = <String, CityInfo>{};
var neighborhoods = <String, NeighborhoodInfo>{};