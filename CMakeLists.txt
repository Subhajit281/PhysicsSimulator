

cmake_minimum_required(VERSION 3.10)
project(PhysicsSimulator)

set(CMAKE_CXX_STANDARD 17)

set(SFML_DIR "C:/SFML-2.6.2/lib/cmake/SFML")
find_package(SFML 2.5 COMPONENTS graphics window system REQUIRED)

include_directories(include)

add_executable(Ball src/ball_main.cpp src/Ball.cpp)
add_executable(Wave src/wave_main.cpp src/Wave.cpp)
add_executable(Electric src/electric_main.cpp src/Electric_Field.cpp)
add_executable(Friction src/friction_main.cpp src/Friction.cpp)
add_executable(Magnetic src/magnetic_main.cpp src/Magnetic.cpp)
add_executable(Oscillation src/oscillation_main.cpp src/Oscillation.cpp)
add_executable(Pulley src/pulley_main.cpp src/Pulley.cpp)
add_executable(Boid src/boid_main.cpp src/Boid.cpp src/boidsAlgorithm.cpp )
add_executable(Universe src/universe_main.cpp src/Universe.cpp)
add_executable(Light src/light_main.cpp src/Light.cpp)
add_executable(Sandbox src/sandbox_main.cpp src/Sandbox.cpp src/Ball.cpp)

target_link_libraries(Ball sfml-graphics sfml-window sfml-system)
target_link_libraries(Wave sfml-graphics sfml-window sfml-system)
target_link_libraries(Electric sfml-graphics sfml-window sfml-system)
target_link_libraries(Friction sfml-graphics sfml-window sfml-system)
target_link_libraries(Magnetic sfml-graphics sfml-window sfml-system)
target_link_libraries(Oscillation sfml-graphics sfml-window sfml-system)
target_link_libraries(Pulley sfml-graphics sfml-window sfml-system)
target_link_libraries(Boid sfml-graphics sfml-window sfml-system)
target_link_libraries(Sandbox sfml-graphics sfml-window sfml-system)
target_link_libraries(Universe sfml-graphics sfml-window sfml-system)
target_link_libraries(Light sfml-graphics sfml-window sfml-system)