/**
 * Created by justsavor on 15/4/29.
 */

var settingModule = angular.module('settingModule',[])

settingModule.controller('SettingCtrl',['$scope','$http','$modal', function ($scope,$http,$modal) {

    $scope.isEdit_Comment = false;
    $scope.isEditTexts = "编辑";

    $http.get('http://121.40.106.155:5000/api/v1/literatures/settings')

    $scope.isEditTexts_RefType = "编辑";
    $http.get('http://121.40.106.155:5000/api/v1/literatures/settings')

        .success(function (data) {
            $scope.literatureTypes = data.literatureTypes
            $scope.typeSelected=$scope.literatureTypes[0]
            $scope.allFields = data.fields
            $scope.newLiteratureTypes = []

            $http.get('http://121.40.106.155:5000/api/v1/settings')
                .success(function (data) {
                    $scope.configData = data;
                    //文献配置部分
                    $scope.literatureFields = {}
                    $scope.Selected = {}

                    $scope.literatureTypes.forEach(function (Type) {
                        $scope.literatureFields[Type.name] = data[Type.name]
                        $scope.Selected[Type.name] = []
                    })

                    $scope.allFields.forEach(function (element) {
                        $scope.literatureTypes.forEach(function (inner) {
                            $scope.literatureFields[inner.name].forEach(function (field) {
                                if(element==field)
                                $scope.Selected[inner.name][element] = true;
                            })
                        })
                    })

                    //评论配置部分
                    $http.get('http://121.40.106.155:5000/api/v1/commentSettings')
                        .success(function (data) {
                            $scope.commentFields = data;
                            $scope.commentFields.forEach(function (element) {
                                $scope.configData['commentFieldsIds'].forEach(function (inner) {
                                    if(element.id == inner)
                                        element.selected = true;
                                });

                            });
                        });

                    //配置引用类型部分
                    $http.get('http://121.40.106.155:5000/api/v1/refTypeSettings')
                        .success(function (data) {
                            $scope.refTypeFields = data;
                            $scope.refTypeFields.forEach(function (element) {
                                $scope.configData['refTypesIds'].forEach(function (inner) {
                                    if(element.id == inner)
                                        element.selected = true;
                                });
                            });
                        });
                })
        })

    //$scope.changeType = function () {
    //    $scope.exportFormat = $scope.configData['exportFormat'][$scope.typeSelected];
    //}

    $scope.saveChange = function () {
        var settingsChanged = []
        //$scope.configData['exportFormat'][$scope.typeSelected] = $scope.exportFormat;

        $scope.literatureTypes.forEach(function (Ltype) {
            settingsChanged[Ltype.name]=[];
        })

        $scope.allFields.forEach(function (element) {
            $scope.literatureTypes.forEach(function (Ltype) {
                if($scope.Selected[Ltype.name][element])
                {
                    settingsChanged[Ltype.name].push(element)
                }
            });
        })

        $scope.literatureTypes.forEach(function (element) {
            $scope.configData[element.name] = settingsChanged[element.name]
        })



        var newSetting = {"newSetting":$scope.configData,"newLiteratureTypes":$scope.newLiteratureTypes}

        $http.post('http://121.40.106.155:5000/api/v1/settings',newSetting)
            .success(function (data) {
                if(data=='success')
                alert("保存配置成功！")
                else
                alert("保存配置失败")
            })
    }

    $scope.addLiteratureType = function () {
        $scope.literatureTypes.forEach(function (element) {
            if (element.name == $scope.literatureTypeAdded)
            {
                alert("不可重复添加")
                return;
            }
        })

        var typeTobeAdded = {"type_id":1,"name":$scope.literatureTypeAdded};
        $scope.Selected[$scope.literatureTypeAdded]=[]
        $scope.literatureFields[$scope.literatureTypeAdded] = []
        $scope.literatureTypes.push(typeTobeAdded)
        $scope.newLiteratureTypes.push(typeTobeAdded)
        $scope.typeSelected = $scope.literatureTypes[$scope.literatureTypes.length-1]

        $http.post('http://121.40.106.155:5000/api/v1/types',typeTobeAdded)
            .success(function (data) {
                alert("添加类型成功！")
            })

    }

    $scope.deleteLiteratureType = function () {
        alert("外键太多不好删除...")

        //$http.delete("http://121.40.106.155:5000/api/v1/types/"+$scope.typeSelected.id)
        //    .success(function (data) {
        //        $scope.configData[$scope.typeSelected.name] = null;
        //        $http.post('http://121.40.106.155:5000/api/v1/commentSettings',{"newSetting":$scope.configData});
        //        for(var i =0;i<$scope.literatureTypes.length;i++)
        //            if($scope.literatureTypes[i].name==$scope.typeSelected.name)
        //                $scope.literatureTypes.splice(i,1);
        //    });
    }



    $scope.saveCommentChanges = function () {
        var commentChanges = []

        $scope.commentFields.forEach(function (element) {
            if(element.selected)
                commentChanges.push(element.id);
        });

        $scope.configData['commentFieldsIds'] = commentChanges;
        $http.post('http://121.40.106.155:5000/api/v1/commentSettings',{"newSetting":$scope.configData})
            .success(function (data) {
                if(data=='success')
                    alert("保存配置成功！")
                else
                    alert("保存配置失败")
            })

    }

    $scope.saveRefTypeChanges = function () {
        var refTypeChanges = [];

        $scope.refTypeFields.forEach(function (element) {
            if(element.selected)
                refTypeChanges.push(element.id);
        });

        $scope.configData['refTypesIds'] = refTypeChanges;
        $http.post('http://121.40.106.155:5000/api/v1/refTypeSettings',{"newSetting":$scope.configData})
            .success(function (data) {
                if(data=='success')
                    alert("保存配置成功！")
                else
                    alert("保存配置失败")
            })

    }

    $scope.addCommentField = function () {
        var commentFieldAdded = {"type":2,"name":$scope.commentFieldNameAdded}
        $http.post("http://121.40.106.155:5000/api/v1/attributes",commentFieldAdded)
            .success(function (data) {
                $scope.commentFields.push(data);
            })
    }

    $scope.addRefTypeField = function () {
        var refTypeAdded = {"type":3,"name":$scope.refTypeFieldNameAdded}
        $http.post("http://121.40.106.155:5000/api/v1/attributes",refTypeAdded)
            .success(function (data) {
                $scope.refTypeFields.push(data);
            })
    }

    $scope.editComment = function () {
        if(!$scope.isEdit_Comment)
        {
            $scope.isEditTexts = "保存"

        }else
        {
            $scope.commentFields.forEach(function (element) {
                $http.put("http://121.40.106.155:5000/api/v1/attributes/"+element.id,element)
            });
            $scope.isEditTexts = "编辑"
        }
        $scope.isEdit_Comment= !$scope.isEdit_Comment;
    }

    $scope.editRefType = function () {
        if(!$scope.isEdit_RefType)
        {
            $scope.isEditTexts_Ref = "保存"

        }else
        {
            $scope.refTypeFields.forEach(function (element) {
                $http.put("http://121.40.106.155:5000/api/v1/attributes/"+element.id,element)
            });
            $scope.isEditTexts_Ref = "编辑"
        }
        $scope.isEdit_RefType= !$scope.isEdit_RefType;
    }



    $scope.deleteCommentField = function () {
        for(var i = 0;i<$scope.commentFields.length;i++)
        {
            if($scope.commentFields[i].selected)
            {
                $http.delete("http://121.40.106.155:5000/api/v1/attributes/"+$scope.commentFields[i].id);
                $scope.commentFields.splice(i,1);
            }
        }
    }

    $scope.deleteRefTypeField = function () {
        for(var i = 0;i<$scope.refTypeFields.length;i++)
        {
            if($scope.refTypeFields[i].selected)
            {
                $http.delete("http://121.40.106.155:5000/api/v1/attributes/"+$scope.refTypeFields[i].id);
                $scope.refTypeFields.splice(i,1);
            }
        }
    }


    Array.prototype.contains = function (element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == element) {
                return true;
            }
        }
        return false;
    }

    $scope.tagsDivided = [];

    //获取分组的tag
    $http.get("http://121.40.106.155:5000/api/v1/tags")
        .success(function (data) {
            $scope.allTags = data;
            $scope.tagTypes = [] ;
            $scope.allTags.forEach(function (tag) {
                if($scope.tagsDivided[tag.type] == null)
                {
                    $scope.tagsDivided[tag.type] = new Array();
                    $scope.tagsDivided[tag.type].push(tag);
                }
                else
                {
                    $scope.tagsDivided[tag.type].push(tag);
                }


                if($scope.tagTypes.contains(tag.type))
                    ;
                else
                    $scope.tagTypes.push(tag.type);
            })

        });


    $scope.changeTagType = function (tag) {

        var ModalInstance = $modal.open({
            templateUrl: 'partial/ChangeTagType.html',
            controller: 'tagTypeCtrl',
            size:'sm',
            resolve:
            {
                tagTypes: function () {
                    return $scope.tagTypes
                }
            }
        });


        ModalInstance.result.then(function (tagType) {
            if(tagType == "delete")
            {//删除标签
                $http.delete('http://121.40.106.155:5000/api/v1/tags/'+tag.id)
                    .success(function (data) {
                        var i = $scope.tagsDivided[tag.type].indexOf(tag);
                        $scope.tagsDivided[tag.type].splice(i,1);
                        alert("删除标签成功");
                    })
            }
            else{//更改便签类型
                var i = $scope.tagsDivided[tag.type].indexOf(tag);
                $scope.tagsDivided[tag.type].splice(i,1);
                tag.type = tagType;
                $scope.tagsDivided[tag.type].push(tag);

                $http.put('http://121.40.106.155:5000/api/v1/tags/'+tag.id,tag).
                    success(function (data) {

                    });
            }

        }, function () {

        });
    };

    $scope.newTag = {};

    $scope.addTag = function () {
        if($scope.newTag.name && $scope.newTag.type)
        $http.post("http://121.40.106.155:5000/api/v1/tags",$scope.newTag)
            .success(function (data) {
                alert("增加标签成功");
                $scope.tagsDivided[data.type].push(data);
            })
        else
            alert("请输入便签类型和名称");
    }


}])

settingModule.controller('tagTypeCtrl', function ($scope,$modalInstance,$http,tagTypes) {
    $scope.tagTypes = tagTypes;
    $scope.submit = function (tagType) {
        $modalInstance.close(tagType);
    }

    $scope.delete = function () {
        $modalInstance.close("delete");
    }


    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
})
