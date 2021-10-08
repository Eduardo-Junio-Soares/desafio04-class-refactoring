import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import { Food } from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

export function Dashboard() {
  const [foods, setfoods] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingFood, setEditingFood] = useState({});
  const [editOpenModal, setEditOpenModal] = useState(false);

  useEffect(() => {
    api.get(`/foods`).then((res) => setfoods(res.data));
  }, []);

  const handleAddFood = async (food) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setfoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setfoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleDeleteFood = async (id) => {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter((food) => food.id !== id);

    setfoods(foodsFiltered);
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setEditOpenModal(true);
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const toggleEditModal = () => {
    setEditOpenModal(!editOpenModal);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={openModal}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editOpenModal}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
