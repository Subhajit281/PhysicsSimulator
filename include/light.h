#pragma once
#pragma once
#include "Simulation.h"
#include <SFML/Graphics.hpp>
#include <string>

class Light : public Simulation
{
public:
    void run() override;

private:

    std::string toStr(float v);

    void DrawAxis(sf::RenderWindow& window, float axisY);
    void DrawObject(sf::RenderWindow& window, float x, float axisY, float height);
    void DrawImage(sf::RenderWindow& window, float x, float axisY, float height);
    void DrawFocus(sf::RenderWindow& window, float x, float axisY, sf::Color color);

    void RunPlaneMirrorSimulation();
    void RunConcaveMirrorSimulation();
    void RunConvexMirrorSimulation();
};