using GuardarOrdenListado.Context;
using System.Collections;

namespace GuardarOrdenListado.Models
{
    public class ListOrderedForUser
    {
        /// <sumary>
        /// Guarda el orden de una lista. Recupera el orden de una lista.
        /// </sumary>
        /// <param name="keyList">Cadena de texto que representa la clave.</param>
        /// <param name="queryList">Query de datos. Se proporciona solo para recuperar el orden.</param>
        /// <param name="keyField">Campo clave del query de datos.</param>
        /// <param name="orderItems">Cadena de IDs de los items de la lista. Se proporciona solo para gravar el orden.</param>
        /// <param name="dbContext">Contexto de la conexión a la DataBase.</param>
        /// <returns>Descripción del valor de retorno</returns>
        public ListOrderedForUser(string keyList, IEnumerable queryList, string keyField, string orderItems, DataBaseContext dbContext)
        {
            DataLists dataLists = dbContext.DataLists.FirstOrDefault(x => x.KeyList == keyList);
            if (dataLists == null)
            {
                DataLists CreateDataList = new DataLists()
                {
                    KeyList = keyList
                };
                dbContext.DataLists.Add(CreateDataList);
                dbContext.SaveChanges();

                int order = 0;
                foreach (var item in (IEnumerable)queryList)
                {
                    OrderLists orderLists = new OrderLists()
                    {
                        IdDataList = CreateDataList.Id,
                        OrderItem = order,
                        IdList = Convert.ToInt32(item.GetType().GetProperty(keyField).GetValue(item, null))
                    };
                    dbContext.OrderLists.Add(orderLists);
                    order++;
                }
                dbContext.SaveChanges();
            }
            else
            {
                if (queryList == null)
                {
                    List<OrderLists> OrderLists = dbContext.OrderLists.Where(x => x.IdDataList == dataLists.Id).ToList();
                    dbContext.OrderLists.RemoveRange(OrderLists);

                    var itemsArray = orderItems.Split(',');
                    int order = 0;
                    foreach (var item in itemsArray)
                    {
                        OrderLists orderLists = new OrderLists()
                        {
                            IdDataList = dataLists.Id,
                            OrderItem = order,
                            IdList = Convert.ToInt32(item)
                        };
                        dbContext.OrderLists.Add(orderLists);

                        order++;
                    }
                    dbContext.SaveChanges();
                }
                else
                {
                    List<object> newList = new List<object>();
                    List<OrderLists> OrderLists = dbContext.OrderLists.Where(x => x.IdDataList == dataLists.Id).OrderBy(x => x.OrderItem).ToList();

                    int order = 0;
                    foreach (var item in OrderLists)
                    {
                        foreach (var itemList in (IEnumerable)queryList)
                        {
                            if (Convert.ToInt32(itemList.GetType().GetProperty(keyField).GetValue(itemList, null)) == item.IdList)
                            {
                                itemList.GetType().GetProperty("Sort").SetValue(itemList, order);
                                break;
                            }
                        }
                        order++;
                    }
                }
            }
        }
    }
}
