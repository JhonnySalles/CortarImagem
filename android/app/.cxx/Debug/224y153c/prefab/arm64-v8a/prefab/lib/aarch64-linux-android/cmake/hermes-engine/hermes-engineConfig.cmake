if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/Jhonny/.gradle/caches/8.14.3/transforms/9f921d33cf300909a7ecb388c59cd0e8/transformed/hermes-android-0.75.5-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Jhonny/.gradle/caches/8.14.3/transforms/9f921d33cf300909a7ecb388c59cd0e8/transformed/hermes-android-0.75.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

