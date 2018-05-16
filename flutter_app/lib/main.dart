import 'dart:async';

import 'package:flutter_google_places_autocomplete/flutter_google_places_autocomplete.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';


const kGoogleApiKey = "AIzaSyCara_NNaxP9HH-kLgwSPNdKBbpa8iWfpg";

// to get places detail (lat/lng)
GoogleMapsPlaces _places = new GoogleMapsPlaces(kGoogleApiKey);

main() {
  runApp(new MaterialApp(
    title: "My App",
    theme: new ThemeData(accentColor: Colors.redAccent),
    routes: {
      "/": (_) => new MyApp(),
      "/search": (_) => new CustomSearchScaffold()
    },
  ));
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => new _MyAppState();
}

final homeScaffoldKey = new GlobalKey<ScaffoldState>();
final searchScaffoldKey = new GlobalKey<ScaffoldState>();

class _MyAppState extends State<MyApp> {
  Mode _mode = Mode.overlay;

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      key: homeScaffoldKey,
      appBar: new AppBar(
        title: new Text("My App"),
      ),
      body: new Center(
          child: new Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              new DropdownButton(
                  value: _mode,
                  items: <DropdownMenuItem<Mode>>[
                    new DropdownMenuItem<Mode>(
                        child: new Text("Overlay"), value: Mode.overlay),
                    new DropdownMenuItem<Mode>(
                        child: new Text("Fullscreen"), value: Mode.fullscreen),
                  ],
                  onChanged: (m) {
                    setState(() {
                      _mode = m;
                    });
                  }),
              new CupertinoButton(
                child: new Text("Search"),
                onPressed: () {
                  Navigator.of(context).pushNamed("/search");
                },
              ),
            ],
          )),
    );
  }
}

Future<Null> displayPrediction(Prediction p, ScaffoldState scaffold) async {
  if (p != null) {
    // get detail (lat/lng)
    PlacesDetailsResponse detail = await _places.getDetailsByPlaceId(p.placeId);
    final lat = detail.result.geometry.location.lat;
    final lng = detail.result.geometry.location.lng;

    scaffold.showSnackBar(
        new SnackBar(content: new Text("${p.description} - $lat/$lng")));
  }
}

// custom scaffold that handle search
// basically your widget need to extends [GooglePlacesAutocompleteWidget]
// and your state [GooglePlacesAutocompleteState]
class CustomSearchScaffold extends GooglePlacesAutocompleteWidget {
  CustomSearchScaffold()
      : super(
      apiKey: kGoogleApiKey,
      language: "en",
      components: [new Component(Component.country, "us")]);

  @override
  _CustomSearchScaffoldState createState() => new _CustomSearchScaffoldState();
}

class _CustomSearchScaffoldState extends GooglePlacesAutocompleteState {
  @override
  Widget build(BuildContext context) {
    final appBar = new AppBar(title: new AppBarPlacesAutoCompleteTextField());
    final body = new GooglePlacesAutocompleteResult(onTap: (p) {
      displayPrediction(p, searchScaffoldKey.currentState);
    });
    return new Scaffold(key: searchScaffoldKey, appBar: appBar, body: body);
  }

  @override
  void onResponseError(PlacesAutocompleteResponse response) {
    super.onResponseError(response);
    searchScaffoldKey.currentState
        .showSnackBar(new SnackBar(content: new Text(response.errorMessage)));
  }

  @override
  void onResponse(PlacesAutocompleteResponse response) {
    super.onResponse(response);
    if (response != null && response.predictions.isNotEmpty) {
      searchScaffoldKey.currentState
          .showSnackBar(new SnackBar(content: new Text("Got answer")));
    }
  }
}