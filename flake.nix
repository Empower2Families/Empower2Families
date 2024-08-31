{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      pkgs = import nixpkgs {
        system = "x86_64-linux";
        config.allowUnfree = true; # Required by Android SDK
        config.android_sdk.accept_license = true;
      };
    in {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = with pkgs; [ nodejs_18 androidenv.androidPkgs.androidsdk ];
        ANDROID_HOME = "${pkgs.androidenv.androidPkgs.androidsdk}/libexec/android-sdk";
      };
    };
}
