{ pkgs ? # If pkgs is not defined, use nixpkgs from locked commit
  let
    lock = (builtins.fromJSON (builtins.readFile ./flake.lock)).nodes.nixpkgs.locked;
    nixpkgs = fetchTarball {
      url = "https://github.com/nixos/nixpkgs/archive/${lock.rev}.tar.gz";
      sha256 = lock.narHash;
    };
  in
  import nixpkgs {
    config.allowUnfree = true; # Required by Android SDK
    config.android_sdk.accept_license = true;
  }
, ...
}:
let
  androidComposition = pkgs.androidenv.composeAndroidPackages { };
in {
  default = pkgs.mkShell {
    packages = with pkgs; [ nodejs_20 androidComposition.androidsdk nodePackages.typescript-language-server nil ];
    ANDROID_HOME = "${androidComposition.androidsdk}/libexec/android-sdk";
  };
}
