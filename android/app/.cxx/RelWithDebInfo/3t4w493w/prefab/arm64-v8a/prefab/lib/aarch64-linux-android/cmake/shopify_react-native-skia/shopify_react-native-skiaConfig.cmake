if(NOT TARGET shopify_react-native-skia::rnskia)
add_library(shopify_react-native-skia::rnskia SHARED IMPORTED)
set_target_properties(shopify_react-native-skia::rnskia PROPERTIES
    IMPORTED_LOCATION "F:/Projetos/CortarImagem/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/RelWithDebInfo/dr4ds286/obj/arm64-v8a/librnskia.so"
    INTERFACE_INCLUDE_DIRECTORIES "F:/Projetos/CortarImagem/node_modules/@shopify/react-native-skia/android/build/headers/rnskia"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

