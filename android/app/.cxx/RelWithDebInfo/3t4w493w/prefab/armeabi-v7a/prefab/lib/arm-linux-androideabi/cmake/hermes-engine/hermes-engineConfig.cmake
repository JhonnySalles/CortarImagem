if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/Jhonny/.gradle/caches/8.14.3/transforms/738800d99cf1aee56d52e61857108fc9/transformed/hermes-android-0.75.5-release/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Jhonny/.gradle/caches/8.14.3/transforms/738800d99cf1aee56d52e61857108fc9/transformed/hermes-android-0.75.5-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

