class something {
    float pi = 3.14f;
    float radius;

    void setRadius(float rad){
        radius = rad;
    }

    float calculateArea(){
        float area = pi * radius * radius;
        return (area);
    }

    public static void main(String args[]){
        something obj = new something();
        obj.setRadius(3.1f);
        float areae = obj.calculateArea();
        System.out.println(areae);
    }
}